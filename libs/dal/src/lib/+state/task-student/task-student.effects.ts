import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';
import { map } from 'rxjs/operators';
import { DalState } from '..';
import {
  TaskStudentServiceInterface,
  TASK_STUDENT_SERVICE_TOKEN
} from '../../tasks/task-student.service.interface';
import {
  loadTaskStudents,
  taskStudentsLoaded,
  taskStudentsLoadError
} from './task-student.actions';

@Injectable()
export class TaskStudentEffects {
  @Effect()
  loadTaskStudents$ = this.dataPersistence.fetch(loadTaskStudents, {
    run: (action: ReturnType<typeof loadTaskStudents>, state: DalState) => {
      if (!action.force && state.taskStudents.loaded) return;
      return this.taskStudentService
        .getAllForUser(action.userId)
        .pipe(map(taskStudents => taskStudentsLoaded({ taskStudents })));
    },
    onError: (action: ReturnType<typeof loadTaskStudents>, error) => {
      return taskStudentsLoadError({ error });
    }
  });

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<DalState>,
    @Inject(TASK_STUDENT_SERVICE_TOKEN)
    private taskStudentService: TaskStudentServiceInterface
  ) {}
}
