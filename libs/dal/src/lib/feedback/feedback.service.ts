import { Injectable, InjectionToken } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarDismiss,
  MatSnackBarRef,
  SimpleSnackBar
} from '@angular/material/snack-bar';
import { Action, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { filter, map, shareReplay, switchMap } from 'rxjs/operators';
import { DalState } from '../+state';
import { ActionSuccessful } from '../+state/dal.actions';
import { EffectFeedbackInterface } from './feedback.service';

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
    // TODO delete
    const mockAction = {
      title: 'klik',
      userAction: new ActionSuccessful({
        successfulAction: 'dismiss with action'
      })
    };

    // TODO delete
    const mockFeedBack: EffectFeedbackInterface = {
      id: '1',
      triggerAction: null,
      message: 'This is a message',
      type: 'success',
      userActions: [mockAction],
      timeStamp: 1,
      display: true,
      priority: Priority.HIGH
    };

    // this.nextFeedback$ = timer(1000, 4000).pipe(mapTo(mockFeedBack)); //TODO use code below
    this.nextFeedback$ = this.store
      .select(EffectFeedbackQueries.getNext)
      .pipe(shareReplay(1)); // needed? -> share() ?
  }

  private setIntermediateStreams(): void {
    this.errorFeedback$ = this.nextFeedback$.pipe(
      filter(feedback => feedback.type === 'error')
    );

    this.successFeedback$ = this.nextFeedback$.pipe(
      filter(feedback => feedback.type === 'success')
    );
  }

  private setPresentationStreams(): void {
    this.bannerFeedback$ = this.errorFeedback$.pipe(
      switchMap(feedback => of(feedback)) //TODO switchmap needed?
    );

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
        //this.store.dispatch( *Remove Feedback action* )
        this.store.dispatch(
          new ActionSuccessful({ successfulAction: 'remove the feedback' })
        );
      }
    );
  }
}

// TODO delete and replace with import from ResponseState-branch
export interface EffectFeedbackInterface {
  id: string;
  triggerAction: Action;
  icon?: string;
  message: string;
  type: 'success' | 'error';
  userActions: {
    // buttons: expected action is right aligned, first in array
    title: string;
    userAction: Action;
  }[];
  timeStamp: number;
  display: boolean;
  priority: Priority;
}

// TODO delete and replace with import from ResponseState-branch
export enum Priority {
  LOW = 1,
  NORM = 2,
  HIGH = 3
}
