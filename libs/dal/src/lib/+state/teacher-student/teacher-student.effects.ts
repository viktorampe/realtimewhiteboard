import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { DataPersistence } from '@nrwl/nx';
import { from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { DalState } from '..';
import {
  LinkedPersonServiceInterface,
  LINKED_PERSON_SERVICE_TOKEN
} from '../../persons/linked-persons.service';
import {
  EffectFeedback,
  EffectFeedbackActions,
  Priority
} from '../effect-feedback';
import {
  AddLinkedPerson,
  DeleteLinkedPerson
} from '../linked-person/linked-person.actions';
import {
  DeleteTeacherStudent,
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
        const userId = action.payload.userId;

        return this.linkedPersonService
          .linkStudentToTeacher(action.payload.publicKey)
          .pipe(
            switchMap(teachers => {
              const effectFeedback = new EffectFeedback({
                id: this.uuid(),
                triggerAction: action,
                message: 'Leerkracht is gekoppeld.',
                type: 'success'
              });
              const actions = [].concat(
                // update state for active page
                teachers.map(person => new AddLinkedPerson({ person })),
                new LoadTeacherStudents({ userId, force: true }),
                new EffectFeedbackActions.AddEffectFeedback({
                  effectFeedback
                })
              );
              return from<Action>(actions);
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
          display: action.payload.handleErrorAutomatically,
          priority: Priority.HIGH
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
        // add teacherStudentId to payload instead of searching state?
        const teacherStudentId = (state.teacherStudents.ids as number[]).find(
          id => state.teacherStudents.entities[id].teacherId === teacherId
        );

        return this.linkedPersonService
          .unlinkStudentFromTeacher(userId, teacherStudentId)
          .pipe(
            switchMap(() => {
              const effectFeedback = new EffectFeedback({
                id: this.uuid(),
                triggerAction: action,
                message: 'Leerkracht is ontkoppeld.'
              });
              const actions = [].concat(
                // update state for active page
                new DeleteLinkedPerson({ id: teacherId }),
                new DeleteTeacherStudent({ id: teacherStudentId }),
                new EffectFeedbackActions.AddEffectFeedback({
                  effectFeedback
                })
              );
              return from<Action>(actions);
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
          priority: Priority.HIGH
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
