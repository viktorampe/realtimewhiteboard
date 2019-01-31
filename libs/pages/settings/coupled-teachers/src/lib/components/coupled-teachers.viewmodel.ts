import { Inject, Injectable } from '@angular/core';
import {
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  DalState,
  EffectFeedbackInterface,
  EffectFeedbackQueries,
  LinkedPersonQueries,
  PersonInterface,
  TeacherStudentActions,
  UserQueries
} from '@campus/dal';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ApiValidationErrors } from './coupled-teachers/coupled-teachers.component';

@Injectable({
  providedIn: 'root'
})
export class CoupledTeachersViewModel {
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
            break;
        }
        return {
          apiError: true
        };
      })
    );
  }

  public linkPerson(publicKey: string): void {
    this.store.dispatch(
      new TeacherStudentActions.LinkTeacherStudent({ publicKey })
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
