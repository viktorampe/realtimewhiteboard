import { Update } from '@ngrx/entity';
import { createAction, props } from '@ngrx/store';
import { TaskGroupInterface } from '../../+models';

export const loadTaskGroups = createAction(
  '[TaskGroup] Load TaskGroups',
  (userId: number = null, force: boolean = false) => ({
    userId,
    force
  })
);

export const taskGroupsLoaded = createAction(
  '[TaskGroup] TaskGroups loaded',
  props<{ taskGroups: TaskGroupInterface[] }>()
);

export const taskGroupsLoadError = createAction(
  '[TaskGroup] Load Error',
  props<{ error: any }>()
);

export const addTaskGroup = createAction(
  '[TaskGroup] Add TaskGroup',
  props<{ taskGroup: TaskGroupInterface }>()
);

export const upsertTaskGroup = createAction(
  '[TaskGroup] Upsert TaskGroup',
  props<{ taskGroup: TaskGroupInterface }>()
);

export const addTaskGroups = createAction(
  '[TaskGroup] Add TaskGroups',
  props<{ taskGroups: TaskGroupInterface[] }>()
);

export const upsertTaskGroups = createAction(
  '[TaskGroup] Upsert TaskGroups',
  props<{ taskGroups: TaskGroupInterface[] }>()
);

export const updateTaskGroup = createAction(
  '[TaskGroup] Update TaskGroup',
  props<{ taskGroup: Update<TaskGroupInterface> }>()
);

export const updateTaskGroups = createAction(
  '[TaskGroup] Update TaskGroups',
  props<{ taskGroups: Update<TaskGroupInterface>[] }>()
);

export const deleteTaskGroup = createAction(
  '[TaskGroup] Delete TaskGroup',
  props<{ id: number }>()
);

export const deleteTaskGroups = createAction(
  '[TaskGroup] Delete TaskGroups',
  props<{ ids: number[] }>()
);

export const clearTaskGroups = createAction('[TaskGroup] Clear TaskGroups');

export const updateTaskGroupsAccess = createAction(
  '[TaskGroup] Update Access',
  props<{ taskId: number; taskGroups: TaskGroupInterface[] }>()
);
