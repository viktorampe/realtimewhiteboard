import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { map } from 'rxjs/operators';
import { DalState } from '..';
import {
  LinkedPersonServiceInterface,
  LINKED_PERSON_SERVICE_TOKEN
} from '../../persons/linked-persons.service';
import { EffectFeedback, EffectFeedbackActions } from '../effect-feedback';
import {
  LinkTeacherStudent,
  LoadTeacherStudents,
  TeacherStudentActionTypes,
  TeacherStudentsLoaded,
  TeacherStudentsLoadError,
  UnlinkTeacherStudent
} from './teacher-student.actions';

@Injectable()
export class TeacherStudentEffects {
  @Effect()
  loadTeacherStudents$ = this.dataPersistence.fetch(
    TeacherStudentActionTypes.LoadTeacherStudents,
    {
      run: (action: LoadTeacherStudents, state: DalState) => {
        if (!action.payload.force && state.teacherStudents.loaded) return;
        return this.linkedPersonService
          .getTeacherStudentsForUser(action.payload.userId)
          .pipe(
            map(
              teacherStudents => new TeacherStudentsLoaded({ teacherStudents })
            )
          );
      },
      onError: (action: LoadTeacherStudents, error) => {
        return new TeacherStudentsLoadError(error);
      }
    }
  );

  @Effect()
  linkTeacher$ = this.dataPersistence.pessimisticUpdate(
    TeacherStudentActionTypes.LinkTeacherStudent,
    {
      run: (action: LinkTeacherStudent, state: DalState) => {
        return this.linkedPersonService
          .linkStudentToTeacher(action.payload.publicKey)
          .pipe(
            map(() => {
              const effectFeedback = new EffectFeedback({
                id: this.uuid(),
                triggerAction: action,
                message: 'Leerkracht is gekoppeld.',
                type: 'success'
              });
              return new EffectFeedbackActions.AddEffectFeedback({
                effectFeedback
              });
            })
          );
      },
      onError: (action: LinkTeacherStudent, error) => {
        // display =  false, because the error should be handled by the form
        const effectFeedback = new EffectFeedback({
          id: this.uuid(),
          triggerAction: action,
          message: error.message,
          type: 'error',
          display: false
        });
        return new EffectFeedbackActions.AddEffectFeedback({
          effectFeedback
        });
      }
    }
  );

  @Effect()
  unlinkTeacher$ = this.dataPersistence.pessimisticUpdate(
    TeacherStudentActionTypes.UnlinkTeacherStudent,
    {
      run: (action: UnlinkTeacherStudent, state: DalState) => {
        const userId = action.payload.userId;
        const teacherId = action.payload.teacherId;
        const teacherStudentId = (state.teacherStudents.ids as number[]).find(
          id => state.teacherStudents.entities[id].teacherId === teacherId
        );

        return this.linkedPersonService
          .unlinkStudentFromTeacher(userId, teacherStudentId)
          .pipe(
            map(() => {
              const effectFeedback = new EffectFeedback({
                id: this.uuid(),
                triggerAction: action,
                message: 'Leerkracht is ontkoppeld.',
                type: 'success'
              });
              return new EffectFeedbackActions.AddEffectFeedback({
                effectFeedback
              });
            })
          );
      },
      onError: (action: UnlinkTeacherStudent, error) => {
        const effectFeedback = new EffectFeedback({
          id: this.uuid(),
          triggerAction: action,
          message: 'Het is niet gelukt om de leerkracht te ontkoppelen.',
          type: 'error',
          userActions: [{ title: 'Probeer opnieuw', userAction: action }],
          display: true
        });
        return new EffectFeedbackActions.AddEffectFeedback({
          effectFeedback
        });
      }
    }
  );

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<DalState>,
    @Inject(LINKED_PERSON_SERVICE_TOKEN)
    private linkedPersonService: LinkedPersonServiceInterface,
    @Inject('uuid') private uuid: Function
  ) {}
}
