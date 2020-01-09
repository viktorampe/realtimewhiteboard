import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { TaskClassGroupInterface } from '../../+models';
import * as TaskClassGroupActions from './task-class-group.actions';

export const NAME = 'taskClassGroups';

export interface State extends EntityState<TaskClassGroupInterface> {
  // additional entities state properties
  loaded: boolean;
  error?: any;
}

export const adapter: EntityAdapter<
  TaskClassGroupInterface
> = createEntityAdapter<TaskClassGroupInterface>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  loaded: false
});

const taskClassGroupReducer = createReducer(
  initialState,
  on(TaskClassGroupActions.addTaskClassGroup, (state, { taskClassGroup }) =>
    adapter.addOne(taskClassGroup, state)
  ),
  on(TaskClassGroupActions.upsertTaskClassGroup, (state, { taskClassGroup }) =>
    adapter.upsertOne(taskClassGroup, state)
  ),
  on(TaskClassGroupActions.addTaskClassGroups, (state, { taskClassGroups }) =>
    adapter.addMany(taskClassGroups, state)
  ),
  on(
    TaskClassGroupActions.upsertTaskClassGroups,
    (state, { taskClassGroups }) => adapter.upsertMany(taskClassGroups, state)
  ),
  on(TaskClassGroupActions.updateTaskClassGroup, (state, { taskClassGroup }) =>
    adapter.updateOne(taskClassGroup, state)
  ),
  on(
    TaskClassGroupActions.updateTaskClassGroups,
    (state, { taskClassGroups }) => adapter.updateMany(taskClassGroups, state)
  ),
  on(TaskClassGroupActions.deleteTaskClassGroup, (state, { id }) =>
    adapter.removeOne(id, state)
  ),
  on(TaskClassGroupActions.deleteTaskClassGroups, (state, { ids }) =>
    adapter.removeMany(ids, state)
  ),
  on(
    TaskClassGroupActions.taskClassGroupsLoaded,
    (state, { taskClassGroups }) =>
      adapter.addAll(taskClassGroups, { ...state, loaded: true })
  ),
  on(TaskClassGroupActions.taskClassGroupsLoadError, (state, { error }) => ({
    ...state,
    error,
    loaded: false
  })),
  on(TaskClassGroupActions.clearTaskClassGroups, state =>
    adapter.removeAll(state)
  )
);

export function reducer(state: State | undefined, action: Action) {
  return taskClassGroupReducer(state, action);
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = adapter.getSelectors();
