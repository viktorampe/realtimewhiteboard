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
import { LoadBundles } from '../bundle/bundle.actions';
import { ActionSuccessful } from '../dal.actions';
import { AddLinkedPerson } from './../linked-person/linked-person.actions';
import { LoadTasks } from './../task/task.actions';
import {
  AddTeacherStudent,
  LinkTeacherStudents,
  LoadTeacherStudents,
  TeacherStudentActionTypes,
  TeacherStudentsLoaded,
  TeacherStudentsLoadError
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
    TeacherStudentActionTypes.LinkTeacherStudents,
    {
      run: (action: LinkTeacherStudents, state: DalState) => {
        const userId = state.user.currentUser.id;

        return this.linkedPersonService
          .linkStudentToTeacher(action.payload.publicKey)
          .pipe(
            map(teachers => ({
              // add all returned teachers to the linked persons
              // add a temporary TeacherStudent per teacher
              ...teachers.reduce(
                (acc, teacher) => ({
                  ...acc,
                  ...new AddLinkedPerson({ person: teacher }),
                  ...new AddTeacherStudent({
                    teacherStudent: {
                      created: new Date(),
                      teacherId: teacher.id,
                      studentId: userId
                    }
                  })
                }),
                [] as Action[]
              ),
              // load all bundles, including those by the new teachers
              ...new LoadBundles({ userId, force: true }),
              // load all tasks, including those by the new teachers
              ...new LoadTasks({ userId, force: true })
            })),
            // emit actions serially
            switchMap((actions: Action[]) => from<Action>(actions))
          );
      },
      onError: (action: LinkTeacherStudents, error) => {
        return new ActionSuccessful({ successfulAction: 'failed' });
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
