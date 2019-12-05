import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { map } from 'rxjs/operators';
import { DalState } from '..';
import {
  TaskStudentServiceInterface,
  TASK_STUDENT_SERVICE_TOKEN
} from '../../tasks/task-student.service.interface';
import {
  LoadTaskStudents,
  TaskStudentsActionTypes,
  TaskStudentsLoaded,
  TaskStudentsLoadError
} from './task-student.actions';

@Injectable()
export class TaskStudentEffects {
  @Effect()
  loadTaskStudents$ = this.dataPersistence.fetch(
    TaskStudentsActionTypes.LoadTaskStudents,
    {
      run: (action: LoadTaskStudents, state: DalState) => {
        if (!action.payload.force && state.taskStudents.loaded) return;
        return this.taskStudentService
          .getAllForUser(action.payload.userId)
          .pipe(map(taskStudents => new TaskStudentsLoaded({ taskStudents })));
      },
      onError: (action: LoadTaskStudents, error) => {
        return new TaskStudentsLoadError(error);
      }
    }
  );

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<DalState>,
    @Inject(TASK_STUDENT_SERVICE_TOKEN)
    private taskStudentService: TaskStudentServiceInterface
  ) {}
}
