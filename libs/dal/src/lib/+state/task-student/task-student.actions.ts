import { Update } from '@ngrx/entity';
import { createAction, props } from '@ngrx/store';
import { TaskStudentInterface } from '../../+models';

export const loadTaskStudents = createAction(
  '[TaskStudent] Load TaskStudents',
  (userId: number = null, force: boolean = false) => ({
    userId,
    force
  })
);

export const taskStudentsLoaded = createAction(
  '[TaskStudent] TaskStudents loaded',
  props<{ taskStudents: TaskStudentInterface[] }>()
);

export const taskStudentsLoadError = createAction(
  '[TaskStudent] Load Error',
  props<{ error: any }>()
);

export const addTaskStudent = createAction(
  '[TaskStudent] Add TaskStudent',
  props<{ taskStudent: TaskStudentInterface }>()
);

export const upsertTaskStudent = createAction(
  '[TaskStudent] Upsert TaskStudent',
  props<{ taskStudent: TaskStudentInterface }>()
);

export const addTaskStudents = createAction(
  '[TaskStudent] Add TaskStudents',
  props<{ taskStudents: TaskStudentInterface[] }>()
);

export const upsertTaskStudents = createAction(
  '[TaskStudent] Upsert TaskStudents',
  props<{ taskStudents: TaskStudentInterface[] }>()
);

export const updateTaskStudent = createAction(
  '[TaskStudent] Update TaskStudent',
  props<{ taskStudent: Update<TaskStudentInterface> }>()
);

export const updateTaskStudents = createAction(
  '[TaskStudent] Update TaskStudents',
  props<{ taskStudents: Update<TaskStudentInterface>[] }>()
);

export const deleteTaskStudent = createAction(
  '[TaskStudent] Delete TaskStudent',
  props<{ id: number }>()
);

export const deleteTaskStudents = createAction(
  '[TaskStudent] Delete TaskStudents',
  props<{ ids: number[] }>()
);

export const clearTaskStudents = createAction(
  '[TaskStudent] Clear TaskStudents'
);

export const updateTaskStudentsAccess = createAction(
  '[TaskStudent] Update Access',
  props<{ taskStudents: TaskStudentInterface[] }>()
);
