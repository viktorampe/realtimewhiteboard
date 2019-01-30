import { Inject, Injectable } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import {
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  DalState,
  EffectFeedback,
  EffectFeedbackQueries,
  LinkedPersonQueries,
  PersonInterface,
  TeacherStudentActions,
  UserQueries
} from '@campus/dal';
import { select, Store } from '@ngrx/store';
import { TeacherStudentActionTypes } from 'libs/dal/src/lib/+state/teacher-student/teacher-student.actions';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

// TODO: update interface + put somewhere else
export interface ActionResponse {
  action: string;
  message: string;
  type: 'success' | 'error';
}

// TODO: put somewhere else
export interface ApiValidationErrors extends ValidationErrors {
  nonExistingTeacherCode?: string;
  apiError?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CoupledTeachersViewModel {
  // source and presentation streams
  public currentUser$: Observable<PersonInterface>;
  public linkedPersons$: Observable<PersonInterface[]>;

  // intermediate streams
  private linkPersonError$: Observable<EffectFeedback>;
  private unlinkPersonError$: Observable<EffectFeedback>;

  // presentation streams
  public apiErrors$: Observable<ApiValidationErrors>;

  // TODO: inject toaster service for showing success message
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
    // TODO: replace pseudo selector code with real selectors
    this.linkPersonError$ = this.store.pipe(
      select(EffectFeedbackQueries.getFeedbackForAction, {
        actionType: TeacherStudentActionTypes.LinkTeacherStudent
      })
    );
    // TODO: replace pseudo selector code with real selectors
    // this.unlinkPersonError$ = this.store.pipe(
    //   select(
    //     ResponseQueries.get({
    //       action:
    //         TeacherStudentActions.TeacherStudentActionTypes
    //           .UnlinkTeacherStudent,
    //       type: 'error'
    //     })
    //   )
    // );
  }

  private setPresentationStreams(): void {
    this.apiErrors$ = this.linkPersonError$.pipe(
      filter(feedback => !!feedback),
      map(feedback => {
        // TODO: switch based on response.message
        switch (feedback.message) {
          case 'teacher_already_linked':
            return {
              teacherAlreadyLinked:
                'Deze leerkracht werd al aan je profiel gelinkt...'
            };
          case 'no_teacher_found_for_given_key':
            return {
              nonExistingTeacherCode: 'Deze code is niet geldig...'
            };
          case 'empty_key':
            return {
              noPublicKey: 'Vul a.u.b. een code in...'
            };
          default:
            break;
        }
        return {
          apiError: feedback.message
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
