import { Inject, Injectable, InjectionToken } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarDismiss,
  MatSnackBarRef,
  SimpleSnackBar
} from '@angular/material/snack-bar';
import { Action, Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { filter, map, share, switchMap } from 'rxjs/operators';
import { DalState } from '../+state';
import {
  EffectFeedbackActions,
  EffectFeedbackInterface,
  EffectFeedbackQueries
} from '../+state/effect-feedback';
import { DeleteEffectFeedback } from './../+state/effect-feedback/effect-feedback.actions';
import { SNACKBAR_DEFAULT_CONFIG_TOKEN } from './snackbar.config';

export const FEEDBACK_SERVICE_TOKEN = new InjectionToken('FeedbackService');
export interface FeedbackServiceInterface {
  bannerFeedback$: Observable<EffectFeedbackInterface>;
}

@Injectable({
  providedIn: 'root'
})
export class FeedbackService implements FeedbackServiceInterface {
  // source
  private nextFeedback$: Observable<EffectFeedbackInterface>;

  // intermediate
  private errorFeedback$: Observable<EffectFeedbackInterface>;
  private successFeedback$: Observable<EffectFeedbackInterface>;
  private displayedBannerFeedback$ = new BehaviorSubject<
    EffectFeedbackInterface
  >(null);

  // presentation
  public bannerFeedback$: Observable<EffectFeedbackInterface>;
  private snackbarAfterDismiss$: Observable<{
    dismissInfo: MatSnackBarDismiss;
    feedback: EffectFeedbackInterface;
  }>;

  constructor(
    private store: Store<DalState>,
    private snackBar: MatSnackBar,
    @Inject(SNACKBAR_DEFAULT_CONFIG_TOKEN)
    private snackbarConfig: MatSnackBarConfig
  ) {
    this.getSourceStreams();
    this.setIntermediateStreams();
    this.setPresentationStreams();
  }

  public onBannerDismiss(event: { action: Action; feedbackId: string }): void {
    this.displayedBannerFeedback$.next(null);

    if (event.action) this.store.dispatch(event.action);

    this.store.dispatch(
      new EffectFeedbackActions.DeleteEffectFeedback({ id: event.feedbackId })
    );
  }

  private getSourceStreams(): void {
    this.nextFeedback$ = this.store
      .select(EffectFeedbackQueries.getNext)
      .pipe(share());
  }

  private setIntermediateStreams(): void {
    this.errorFeedback$ = this.nextFeedback$.pipe(
      filter(feedback => feedback && feedback.type === 'error')
    );

    this.successFeedback$ = this.nextFeedback$.pipe(
      filter(feedback => feedback && feedback.type === 'success')
    );

    combineLatest(
      this.displayedBannerFeedback$.pipe(filter(value => value === null)),
      this.errorFeedback$
    ).subscribe(([displayedFeedback, latestFeedBack]) => {
      if (!displayedFeedback || displayedFeedback.id !== latestFeedBack.id) {
        const feedbackToDisplay = { ...latestFeedBack };

        // if needed, add cancel button
        if (
          !feedbackToDisplay.userActions ||
          feedbackToDisplay.userActions.length < 2
        ) {
          feedbackToDisplay.userActions = [
            ...feedbackToDisplay.userActions,
            {
              title: 'annuleren',
              userAction: null
            }
          ];
        }

        this.displayedBannerFeedback$.next(feedbackToDisplay);
      }
    });
  }

  private setPresentationStreams(): void {
    this.bannerFeedback$ = this.displayedBannerFeedback$;

    this.snackbarAfterDismiss$ = this.successFeedback$.pipe(
      map(feedback => ({
        snackbarRef: this.snackBar.open(
          feedback.message,
          feedback.userActions && feedback.userActions.length
            ? feedback.userActions[0].title
            : null,
          this.snackbarConfig
        ),
        feedback: feedback
      })),
      switchMap(
        (snackbar: {
          snackbarRef: MatSnackBarRef<SimpleSnackBar>;
          feedback: EffectFeedbackInterface;
        }) =>
          snackbar.snackbarRef
            .afterDismissed()
            .pipe(
              map(dismissInfo => ({ dismissInfo, feedback: snackbar.feedback }))
            )
      )
    );

    this.snackbarAfterDismiss$.subscribe(
      (event: {
        dismissInfo: MatSnackBarDismiss;
        feedback: EffectFeedbackInterface;
      }) => {
        if (event.dismissInfo.dismissedByAction) {
          this.store.dispatch(event.feedback.userActions[0].userAction); // a snackbar has max 1 action
        }
        this.store.dispatch(
          new DeleteEffectFeedback({ id: event.feedback.id })
        );
      }
    );
  }
}
