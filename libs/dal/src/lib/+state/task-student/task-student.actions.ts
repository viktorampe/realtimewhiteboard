import { Update } from '@ngrx/entity';
import { createAction, props } from '@ngrx/store';
import { TaskStudentInterface } from '../../+models';

export const loadTaskStudents = createAction(
  '[TaskStudent/API] Load TaskStudents',
  (userId: number = null, force: boolean = false) => ({
    userId,
    force
  })
);

export const taskStudentsLoaded = createAction(
  '[TaskStudent/API] TaskStudents loaded',
  props<{ taskStudents: TaskStudentInterface[] }>()
);

export const taskStudentsLoadError = createAction(
  '[TaskStudent/API] Load Error',
  props<{ error: any }>()
);

export const addTaskStudent = createAction(
  '[TaskStudent/API] Add TaskStudent',
  props<{ taskStudent: TaskStudentInterface }>()
);

export const upsertTaskStudent = createAction(
  '[TaskStudent/API] Upsert TaskStudent',
  props<{ taskStudent: TaskStudentInterface }>()
);

export const addTaskStudents = createAction(
  '[TaskStudent/API] Add TaskStudents',
  props<{ taskStudents: TaskStudentInterface[] }>()
);

export const upsertTaskStudents = createAction(
  '[TaskStudent/API] Upsert TaskStudents',
  props<{ taskStudents: TaskStudentInterface[] }>()
);

export const updateTaskStudent = createAction(
  '[TaskStudent/API] Update TaskStudent',
  props<{ taskStudent: Update<TaskStudentInterface> }>()
);

export const updateTaskStudents = createAction(
  '[TaskStudent/API] Update TaskStudents',
  props<{ taskStudents: Update<TaskStudentInterface>[] }>()
);

export const deleteTaskStudent = createAction(
  '[TaskStudent/API] Delete TaskStudent',
  props<{ id: number }>()
);

export const deleteTaskStudents = createAction(
  '[TaskStudent/API] Delete TaskStudents',
  props<{ ids: number[] }>()
);

export const clearTaskStudents = createAction(
  '[TaskStudent/API] Clear TaskStudents'
);

export const updateTaskStudentsAccess = createAction(
  '[TaskStudent/API] Update Access',
  props<{ taskStudents: TaskStudentInterface[] }>()
);
