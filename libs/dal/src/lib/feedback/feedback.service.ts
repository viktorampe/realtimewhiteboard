import { Inject, Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarRef,
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
  SimpleSnackBar
} from '@angular/material/snack-bar';
import { Action, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { filter, map, mapTo, switchMap } from 'rxjs/operators';
import { DalState } from '../+state';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private nextFeedback$: Observable<EffectFeedbackInterface>;

  private errorFeedback$: Observable<EffectFeedbackInterface>;
  private successFeedback$: Observable<EffectFeedbackInterface>;

  private snackbarFeedback$: Observable<EffectFeedbackInterface>;
  public bannerFeedback$: Observable<EffectFeedbackInterface>;

  constructor(
    private store: Store<DalState>,
    @Inject(MAT_SNACK_BAR_DEFAULT_OPTIONS) private snackBar: MatSnackBar
  ) {
    this.getSourceStreams();
    this.setIntermediateStreams();
    this.setPresentationStreams();
  }

  getSourceStreams(): void {
    this.nextFeedback$ = of(null); //TODO use code below
    // this.nextFeedback$ = this.store.select(EffectFeedbackQueries.getNext);
  }

  setIntermediateStreams(): void {
    this.errorFeedback$ = this.nextFeedback$.pipe(
      filter(feedback => feedback.type === 'error')
    );

    this.successFeedback$ = this.nextFeedback$.pipe(
      filter(feedback => feedback.type === 'success')
    );
  }

  setPresentationStreams(): void {
    this.bannerFeedback$ = this.errorFeedback$.pipe(
      switchMap(feedback => of(feedback))
    );

    this.successFeedback$
      .pipe(
        map(feedback => [
          this.snackBar.open(
            feedback.message,
            feedback.userActions && feedback.userActions.length
              ? feedback.userActions[0].title
              : null
          ),
          feedback
        ]),
        switchMap(
          ([snackBarRef, feedback]: [
            MatSnackBarRef<SimpleSnackBar>,
            EffectFeedbackInterface
          ]) => snackBarRef.onAction().pipe(mapTo(feedback))
        )
      )
      .subscribe(feedback =>
        this.store.dispatch(feedback.userActions[0].userAction)
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
