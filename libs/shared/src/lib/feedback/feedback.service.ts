import { Inject, Injectable, InjectionToken } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarRef,
  SimpleSnackBar
} from '@angular/material/snack-bar';
import { EffectFeedbackInterface } from '@campus/dal';
import { Observable } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { SNACKBAR_DEFAULT_CONFIG_TOKEN } from './snackbar.config';

export const FEEDBACK_SERVICE_TOKEN = new InjectionToken('FeedBackService');
export interface FeedBackServiceInterface {
  snackbarAfterDismiss$: Observable<{
    dismissedWithAction: boolean;
    feedback: EffectFeedbackInterface;
  }>;

  setupStreams(feedback$: Observable<EffectFeedbackInterface>);
}

@Injectable({
  providedIn: 'root'
})
export class FeedBackService implements FeedBackServiceInterface {
  // source
  private feedback$: Observable<EffectFeedbackInterface>;

  // presentation
  public snackbarAfterDismiss$: Observable<{
    dismissedWithAction: boolean;
    feedback: EffectFeedbackInterface;
  }>;

  constructor(
    private snackBar: MatSnackBar,
    @Inject(SNACKBAR_DEFAULT_CONFIG_TOKEN)
    private snackbarConfig: MatSnackBarConfig
  ) {}

  public setupStreams(feedback$: Observable<EffectFeedbackInterface>) {
    this.feedback$ = feedback$;

    this.setPresentationStreams();
  }

  private setPresentationStreams(): void {
    const openedSnackbar$ = this.feedback$.pipe(
      filter(feedback => !!feedback),
      map(feedback => ({
        snackbarRef: this.snackBar.open(
          feedback.message,
          feedback.userActions && feedback.userActions.length
            ? feedback.userActions[0].title
            : null,
          this.snackbarConfig
        ),
        feedback: feedback
      }))
    );

    this.snackbarAfterDismiss$ = openedSnackbar$.pipe(
      switchMap(
        (snackbar: {
          snackbarRef: MatSnackBarRef<SimpleSnackBar>;
          feedback: EffectFeedbackInterface;
        }) =>
          snackbar.snackbarRef.afterDismissed().pipe(
            map(dismissInfo => ({
              dismissedWithAction: dismissInfo.dismissedByAction,
              feedback: snackbar.feedback
            }))
          )
      )
    );
  }
}
