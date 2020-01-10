import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { TaskGroupInterface } from '../../+models';
import * as TaskGroupActions from './task-group.actions';

export const NAME = 'taskGroups';

export interface State extends EntityState<TaskGroupInterface> {
  // additional entities state properties
  loaded: boolean;
  error?: any;
}

export const adapter: EntityAdapter<TaskGroupInterface> = createEntityAdapter<
  TaskGroupInterface
>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  loaded: false
});

const TaskGroupReducer = createReducer(
  initialState,
  on(TaskGroupActions.addTaskGroup, (state, action) =>
    adapter.addOne(action.taskGroup, state)
  ),
  on(TaskGroupActions.upsertTaskGroup, (state, action) =>
    adapter.upsertOne(action.taskGroup, state)
  ),
  on(TaskGroupActions.addTaskGroups, (state, action) =>
    adapter.addMany(action.taskGroups, state)
  ),
  on(TaskGroupActions.upsertTaskGroups, (state, action) =>
    adapter.upsertMany(action.taskGroups, state)
  ),
  on(TaskGroupActions.updateTaskGroup, (state, action) =>
    adapter.updateOne(action.taskGroup, state)
  ),
  on(TaskGroupActions.updateTaskGroups, (state, action) =>
    adapter.updateMany(action.taskGroups, state)
  ),
  on(TaskGroupActions.deleteTaskGroup, (state, action) =>
    adapter.removeOne(action.id, state)
  ),
  on(TaskGroupActions.deleteTaskGroups, (state, action) =>
    adapter.removeMany(action.ids, state)
  ),
  on(TaskGroupActions.clearTaskGroups, state => adapter.removeAll(state)),
  on(TaskGroupActions.taskGroupsLoaded, (state, action) =>
    adapter.addAll(action.taskGroups, { ...state, loaded: true })
  ),
  on(TaskGroupActions.taskGroupsLoadError, (state, action) => {
    return {
      ...state,
      ...{ error: action.error },
      loaded: false
    };
  })
);

export function reducer(state: State | undefined, action: Action) {
  return TaskGroupReducer(state, action);
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = adapter.getSelectors();
