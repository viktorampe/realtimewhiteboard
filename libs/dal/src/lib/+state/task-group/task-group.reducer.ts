import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { TaskGroupInterface } from '../../+models';
import { TaskGroupsActions, TaskGroupsActionTypes } from './task-group.actions';

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

export function reducer(
  state = initialState,
  action: TaskGroupsActions
): State {
  switch (action.type) {
    case TaskGroupsActionTypes.AddTaskGroup: {
      return adapter.addOne(action.payload.taskGroup, state);
    }

    case TaskGroupsActionTypes.UpsertTaskGroup: {
      return adapter.upsertOne(action.payload.taskGroup, state);
    }

    case TaskGroupsActionTypes.AddTaskGroups: {
      return adapter.addMany(action.payload.taskGroups, state);
    }

    case TaskGroupsActionTypes.UpsertTaskGroups: {
      return adapter.upsertMany(action.payload.taskGroups, state);
    }

    case TaskGroupsActionTypes.UpdateTaskGroup: {
      return adapter.updateOne(action.payload.taskGroup, state);
    }

    case TaskGroupsActionTypes.UpdateTaskGroups: {
      return adapter.updateMany(action.payload.taskGroups, state);
    }

    case TaskGroupsActionTypes.DeleteTaskGroup: {
      return adapter.removeOne(action.payload.id, state);
    }

    case TaskGroupsActionTypes.DeleteTaskGroups: {
      return adapter.removeMany(action.payload.ids, state);
    }

    case TaskGroupsActionTypes.TaskGroupsLoaded: {
      return adapter.addAll(action.payload.taskGroups, {
        ...state,
        loaded: true
      });
    }

    case TaskGroupsActionTypes.TaskGroupsLoadError: {
      return { ...state, error: action.payload, loaded: false };
    }

    case TaskGroupsActionTypes.ClearTaskGroups: {
      return adapter.removeAll(state);
    }

    default: {
      return state;
    }
  }
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = adapter.getSelectors();
