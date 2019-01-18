import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { DataPersistence } from '@nrwl/nx';
import { from } from 'rxjs';
import { map, mapTo, switchMap } from 'rxjs/operators';
import { DalState } from '..';
import {
  LinkedPersonServiceInterface,
  LINKED_PERSON_SERVICE_TOKEN
} from '../../persons/linked-persons.service';
import { ActionSuccessful } from '../dal.actions';
import { DeleteBundles, LoadBundles } from './../bundle/bundle.actions';
import {
  AddLinkedPerson,
  DeleteLinkedPerson
} from './../linked-person/linked-person.actions';
import { DeleteTasks, LoadTasks } from './../task/task.actions';
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
        const userId = state.user.currentUser.id;

        return this.linkedPersonService
          .linkStudentToTeacher(action.payload.publicKey)
          .pipe(
            map(teachers => [
              // add all returned teachers to the linked persons
              // add a temporary TeacherStudent per teacher
              ...teachers.reduce(
                (acc, teacher) => [
                  ...acc,
                  new AddLinkedPerson({ person: teacher })
                ],
                [] as Action[]
              ),
              // reload all bundles, including those by the new teachers
              new LoadBundles({ userId, force: true }),
              // reload all tasks, including those by the new teachers
              new LoadTasks({ userId, force: true }),
              new LoadTeacherStudents({ userId, force: true })
            ]),
            // emit actions serially
            switchMap((actions: Action[]) => from<Action>(actions))
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
        const userId = state.user.currentUser.id;
        const teacherId = action.payload.teacherId;
        const teacherStudentId = Object.values(
          state.teacherStudents.entities
        ).find(teacherStudent => teacherStudent.teacherId === teacherId).id;

        return this.linkedPersonService
          .unlinkStudentFromTeacher(userId, teacherStudentId)
          .pipe(
            mapTo([
              // remove teacher from the linked persons
              new DeleteLinkedPerson({ id: teacherId }),
              // remove TeacherStudent
              new DeleteTeacherStudent({ id: teacherStudentId }),
              // remove all bundles of the removed teacher
              new DeleteBundles({
                ids: Object.values(state.bundles.entities)
                  .filter(bundle => bundle.teacherId === teacherId)
                  .map(bundle => bundle.id)
              }),
              // remove all tasks of the removed teacher
              new DeleteTasks({
                ids: Object.values(state.tasks.entities)
                  .filter(task => task.personId === teacherId)
                  .map(task => task.id)
              })
            ]),
            // emit actions serially
            switchMap((actions: Action[]) => from<Action>(actions))
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
