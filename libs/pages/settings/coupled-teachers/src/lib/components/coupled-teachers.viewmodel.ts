import { Inject, Injectable } from '@angular/core';
import {
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  DalState,
  EffectFeedbackActions,
  EffectFeedbackInterface,
  EffectFeedbackQueries,
  LinkedPersonQueries,
  PersonInterface,
  TeacherStudentActions,
  UserQueries
} from '@campus/dal';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { ApiValidationErrors } from './coupled-teachers/coupled-teachers.component';

@Injectable({
  providedIn: 'root'
})
export class CoupledTeachersViewModel {
  private linkPersonErrorfeedbackUuid: string;

  // source and presentation streams
  public currentUser$: Observable<PersonInterface>;
  public linkedPersons$: Observable<PersonInterface[]>;

  // intermediate streams
  private linkPersonError$: Observable<EffectFeedbackInterface>;
  private unlinkPersonError$: Observable<EffectFeedbackInterface>;

  // presentation streams
  public apiErrors$: Observable<ApiValidationErrors>;

  constructor(
    private store: Store<DalState>,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface
  ) {
    this.setSourceStreams();
    this.setIntermediateStreams();
    this.setPresentationStreams();
  }

  private setSourceStreams(): void {
    this.currentUser$ = this.store.pipe(select(UserQueries.getCurrentUser));
    this.linkedPersons$ = this.store.pipe(select(LinkedPersonQueries.getAll));
  }

  private setIntermediateStreams(): void {
    this.linkPersonError$ = this.store.pipe(
      select(EffectFeedbackQueries.getFeedbackForAction, {
        actionType:
          TeacherStudentActions.TeacherStudentActionTypes.LinkTeacherStudent
      }),
      tap(feedback => {
        if (feedback) this.linkPersonErrorfeedbackUuid = feedback.id;
      })
    );
    this.unlinkPersonError$ = this.store.pipe(
      select(EffectFeedbackQueries.getFeedbackForAction, {
        actionType:
          TeacherStudentActions.TeacherStudentActionTypes.UnlinkTeacherStudent
      })
    );
  }

  private setPresentationStreams(): void {
    this.apiErrors$ = this.linkPersonError$.pipe(
      filter(feedback => !!feedback),
      map(feedback => {
        switch (feedback.message) {
          case 'no_teacher_found_for_given_key':
            return {
              nonExistingTeacherCode: true
            };
          case 'empty_key':
            return {
              noPublicKey: true
            };
          default:
            return {
              apiError: true
            };
        }
      })
    );
  }

  public linkPerson(publicKey: string): void {
    //remove possible previous errors so the correct error message is given on the form
    this.store.dispatch(
      new EffectFeedbackActions.DeleteEffectFeedback({
        id: this.linkPersonErrorfeedbackUuid
      })
    );
    this.store.dispatch(
      new TeacherStudentActions.LinkTeacherStudent({
        publicKey,
        userId: this.authService.userId,
        handleErrorAutomatically: false
      })
    );
  }

  public unlinkPerson(teacherId: number): void {
    this.store.dispatch(
      new TeacherStudentActions.UnlinkTeacherStudent({
        teacherId,
        userId: this.authService.userId
      })
    );
  }
}
