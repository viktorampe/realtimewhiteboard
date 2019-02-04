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
import { ActionSuccessful } from '../dal.actions';
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
              const actions = [].concat(
                // update state for active page
                teachers.map(person => new AddLinkedPerson({ person })),
                new LoadTeacherStudents({ userId, force: true })
                // TODO addEffectFeedback
              );
              return from<Action>(actions);
            })
          );
      },
      onError: (action: LinkTeacherStudent, error) => {
        return new ActionSuccessful({
          successfulAction: 'link teacher failed:' + error.message
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
              const actions = [].concat(
                // update state for active page
                new DeleteLinkedPerson({ id: teacherId }),
                new DeleteTeacherStudent({ id: teacherStudentId })
                // TODO addEffectFeedback
              );
              return from<Action>(actions);
            })
          );
      },
      onError: (action: UnlinkTeacherStudent, error) => {
        return new ActionSuccessful({
          successfulAction: 'unlink teacher failed:' + error.message
        });
      }
    }
  );

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<DalState>,
    @Inject(LINKED_PERSON_SERVICE_TOKEN)
    private linkedPersonService: LinkedPersonServiceInterface
  ) {}
}
