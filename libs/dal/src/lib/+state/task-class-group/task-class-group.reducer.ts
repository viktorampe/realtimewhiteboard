import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { TaskClassGroupInterface } from '../../+models';
import {
  TaskClassGroupsActions,
  TaskClassGroupsActionTypes
} from './task-class-group.actions';

export const NAME = 'taskClassGroups';

export interface State extends EntityState<TaskClassGroupInterface> {
  // additional entities state properties
  loaded: boolean;
  error?: any;
}

export const adapter: EntityAdapter<TaskClassGroupInterface> = createEntityAdapter<
  TaskClassGroupInterface
>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  loaded: false
});

export function reducer(
  state = initialState,
  action: TaskClassGroupsActions
): State {
  switch (action.type) {
    case TaskClassGroupsActionTypes.AddTaskClassGroup: {
      return adapter.addOne(action.payload.taskClassGroup, state);
    }

    case TaskClassGroupsActionTypes.UpsertTaskClassGroup: {
      return adapter.upsertOne(action.payload.taskClassGroup, state);
    }

    case TaskClassGroupsActionTypes.AddTaskClassGroups: {
      return adapter.addMany(action.payload.taskClassGroups, state);
    }

    case TaskClassGroupsActionTypes.UpsertTaskClassGroups: {
      return adapter.upsertMany(action.payload.taskClassGroups, state);
    }

    case TaskClassGroupsActionTypes.UpdateTaskClassGroup: {
      return adapter.updateOne(action.payload.taskClassGroup, state);
    }

    case TaskClassGroupsActionTypes.UpdateTaskClassGroups: {
      return adapter.updateMany(action.payload.taskClassGroups, state);
    }

    case TaskClassGroupsActionTypes.DeleteTaskClassGroup: {
      return adapter.removeOne(action.payload.id, state);
    }

    case TaskClassGroupsActionTypes.DeleteTaskClassGroups: {
      return adapter.removeMany(action.payload.ids, state);
    }

    case TaskClassGroupsActionTypes.TaskClassGroupsLoaded: {
      return adapter.addAll(action.payload.taskClassGroups, {
        ...state,
        loaded: true
      });
    }

    case TaskClassGroupsActionTypes.TaskClassGroupsLoadError: {
      return { ...state, error: action.payload, loaded: false };
    }

    case TaskClassGroupsActionTypes.ClearTaskClassGroups: {
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
