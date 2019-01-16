import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { map } from 'rxjs/operators';
import { DalState } from '..';
import {
  LinkedPersonServiceInterface,
  LINKED_PERSON_SERVICE_TOKEN
} from '../../persons/linked-persons.service';
import {
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
        return this.linkedPersonServiceInterface
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

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<DalState>,
    @Inject(LINKED_PERSON_SERVICE_TOKEN)
    private linkedPersonServiceInterface: LinkedPersonServiceInterface
  ) {}
}
