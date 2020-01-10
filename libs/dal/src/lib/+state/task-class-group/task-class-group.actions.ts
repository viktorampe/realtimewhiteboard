import { Update } from '@ngrx/entity';
import { createAction, props } from '@ngrx/store';
import { TaskClassGroupInterface } from '../../+models';

export const loadTaskClassGroups = createAction(
  '[TaskClassGroups] Load TaskClassGroups',
  (userId: number = null, force: boolean = false) => ({
    userId,
    force
  })
);

export const taskClassGroupsLoaded = createAction(
  '[TaskClassGroups] TaskClassGroups Loaded',
  props<{ taskClassGroups: TaskClassGroupInterface[] }>()
);

export const taskClassGroupsLoadError = createAction(
  '[TaskClassGroups] Load Error',
  props<{ error: any }>()
);

export const addTaskClassGroup = createAction(
  '[TaskClassGroups] Add TaskClassGroup',
  props<{ taskClassGroup: TaskClassGroupInterface }>()
);

export const upsertTaskClassGroup = createAction(
  '[TaskClassGroups] Upsert TaskClassGroup',
  props<{ taskClassGroup: TaskClassGroupInterface }>()
);

export const addTaskClassGroups = createAction(
  '[TaskClassGroups] Add TaskClassGroups',
  props<{ taskClassGroups: TaskClassGroupInterface[] }>()
);

export const upsertTaskClassGroups = createAction(
  '[TaskClassGroups] Upsert TaskClassGroups',
  props<{ taskClassGroups: TaskClassGroupInterface[] }>()
);
export const updateTaskClassGroup = createAction(
  '[TaskClassGroups] Update TaskClassGroup',
  props<{ taskClassGroup: Update<TaskClassGroupInterface> }>()
);

export const updateTaskClassGroups = createAction(
  '[TaskClassGroups] Update TaskClassGroups',
  props<{ taskClassGroups: Update<TaskClassGroupInterface>[] }>()
);

export const deleteTaskClassGroup = createAction(
  '[TaskClassGroups] Delete TaskClassGroup',
  props<{ id: number }>()
);

export const deleteTaskClassGroups = createAction(
  '[TaskClassGroups] Delete TaskClassGroups',
  props<{ ids: number[] }>()
);

export const clearTaskClassGroups = createAction(
  '[TaskClassGroups] Clear TaskClassGroups'
);

export const updateTaskClassGroupsAccess = createAction(
  '[TaskClassGroups] Update Access',
  props<{ taskClassGroups: TaskClassGroupInterface[] }>()
);
