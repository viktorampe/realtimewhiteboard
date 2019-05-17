import { Inject, Injectable, InjectionToken } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarRef,
  SimpleSnackBar
} from '@angular/material/snack-bar';
import { EffectFeedbackInterface } from '@campus/dal';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SNACKBAR_DEFAULT_CONFIG_TOKEN } from './snackbar.config';

export const FEEDBACK_SERVICE_TOKEN = new InjectionToken('FeedBackService');
export interface FeedBackServiceInterface {
  addDefaultCancelButton(
    feedback: EffectFeedbackInterface
  ): EffectFeedbackInterface;

  openSnackbar(
    feedback: EffectFeedbackInterface
  ): {
    snackbarRef: MatSnackBarRef<SimpleSnackBar>;
    feedback: EffectFeedbackInterface;
  };

  snackbarAfterDismiss(snackbarInfo: {
    snackbarRef: MatSnackBarRef<SimpleSnackBar>;
    feedback: EffectFeedbackInterface;
  }): Observable<{
    actionToDispatch;
    feedback: EffectFeedbackInterface;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class FeedBackService implements FeedBackServiceInterface {
  constructor(
    private snackBar: MatSnackBar,
    @Inject(SNACKBAR_DEFAULT_CONFIG_TOKEN)
    private snackbarConfig: MatSnackBarConfig
  ) {}

  // adds default cancel button, if needed
  public addDefaultCancelButton(
    feedback: EffectFeedbackInterface
  ): EffectFeedbackInterface {
    if (!feedback) return;

    const feedbackToDisplay = { ...feedback };

    if (feedbackToDisplay.useDefaultCancel) {
      feedbackToDisplay.userActions = [
        ...feedbackToDisplay.userActions,
        {
          title: 'Annuleren',
          userAction: null
        }
      ];
    }

    return feedbackToDisplay;
  }

  // opens snackbar and returns reference and original feedback
  public openSnackbar(
    feedback: EffectFeedbackInterface
  ): {
    snackbarRef: MatSnackBarRef<SimpleSnackBar>;
    feedback: EffectFeedbackInterface;
  } {
    if (!feedback) return;

    return {
      snackbarRef: this.snackBar.open(
        feedback.message,
        feedback.userActions && feedback.userActions.length
          ? feedback.userActions[0].title
          : null,
        this.snackbarConfig
      ),
      feedback: feedback
    };
  }

  // maps snackBar afterDismissed to the relevant feedback info
  public snackbarAfterDismiss(snackbarInfo: {
    snackbarRef: MatSnackBarRef<SimpleSnackBar>;
    feedback: EffectFeedbackInterface;
  }): Observable<{
    actionToDispatch;
    feedback: EffectFeedbackInterface;
  }> {
    return snackbarInfo.snackbarRef.afterDismissed().pipe(
      map(dismissInfo => ({
        actionToDispatch: dismissInfo.dismissedByAction
          ? snackbarInfo.feedback.userActions[0].userAction // a snackbar has max 1 action
          : null,
        feedback: snackbarInfo.feedback
      }))
    );
  }
}
