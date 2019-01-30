import { Injectable, InjectionToken } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarDismiss,
  MatSnackBarRef,
  SimpleSnackBar
} from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map, shareReplay, switchMap } from 'rxjs/operators';
import { DalState } from '../+state';
import {
  EffectFeedbackInterface,
  EffectFeedbackQueries
} from '../+state/effect-feedback';
import { DeleteEffectFeedback } from './../+state/effect-feedback/effect-feedback.actions';

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

  // presentation
  private snackbarAfterDismiss$: Observable<{
    dismissInfo: MatSnackBarDismiss;
    feedback: EffectFeedbackInterface;
  }>;
  public bannerFeedback$: Observable<EffectFeedbackInterface>;

  // default snackbar config
  private snackbarConfig = {
    duration: 3000
  } as MatSnackBarConfig;

  constructor(private store: Store<DalState>, private snackBar: MatSnackBar) {
    this.getSourceStreams();
    this.setIntermediateStreams();
    this.setPresentationStreams();
  }

  private getSourceStreams(): void {
    this.nextFeedback$ = this.store
      .select(EffectFeedbackQueries.getNext)
      .pipe(shareReplay(1));
  }

  private setIntermediateStreams(): void {
    this.errorFeedback$ = this.nextFeedback$.pipe(
      filter(feedback => feedback && feedback.type === 'error')
    );

    this.successFeedback$ = this.nextFeedback$.pipe(
      filter(feedback => feedback && feedback.type === 'success')
    );
  }

  private setPresentationStreams(): void {
    this.bannerFeedback$ = this.errorFeedback$;

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
          console.log('dismissed with action');
        } else {
          console.log('dismissed without action');
        }
        this.store.dispatch(
          new DeleteEffectFeedback({ id: event.feedback.id })
        );
      }
    );
  }
}
