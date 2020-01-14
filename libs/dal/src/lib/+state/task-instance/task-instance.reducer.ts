import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { TaskInstanceInterface } from '../../+models';
import {
  TaskInstancesActions,
  TaskInstancesActionTypes
} from './task-instance.actions';

export const NAME = 'taskInstances';

export interface State extends EntityState<TaskInstanceInterface> {
  // additional entities state properties
  loaded: boolean;
  error?: any;
}

export const adapter: EntityAdapter<TaskInstanceInterface> = createEntityAdapter<
  TaskInstanceInterface
>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  loaded: false
});

export function reducer(
  state = initialState,
  action: TaskInstancesActions
): State {
  switch (action.type) {
    case TaskInstancesActionTypes.AddTaskInstance: {
      return adapter.addOne(action.payload.taskInstance, state);
    }

    case TaskInstancesActionTypes.UpsertTaskInstance: {
      return adapter.upsertOne(action.payload.taskInstance, state);
    }

    case TaskInstancesActionTypes.AddTaskInstances: {
      return adapter.addMany(action.payload.taskInstances, state);
    }

    case TaskInstancesActionTypes.UpsertTaskInstances: {
      return adapter.upsertMany(action.payload.taskInstances, state);
    }

    case TaskInstancesActionTypes.UpdateTaskInstance: {
      return adapter.updateOne(action.payload.taskInstance, state);
    }

    case TaskInstancesActionTypes.UpdateTaskInstances: {
      return adapter.updateMany(action.payload.taskInstances, state);
    }

    case TaskInstancesActionTypes.DeleteTaskInstance: {
      return adapter.removeOne(action.payload.id, state);
    }

    case TaskInstancesActionTypes.DeleteTaskInstances: {
      return adapter.removeMany(action.payload.ids, state);
    }

    case TaskInstancesActionTypes.TaskInstancesLoaded: {
      const instances = action.payload.taskInstances.map(instance => {
        return {
          ...instance,
          end:
            typeof instance.end === 'string'
              ? new Date(instance.end)
              : instance.end,
          start:
            typeof instance.start === 'string'
              ? new Date(instance.start)
              : instance.start
        };
      });
      return adapter.addAll(instances, {
        ...state,
        loaded: true
      });
    }

    case TaskInstancesActionTypes.TaskInstancesLoadError: {
      return { ...state, error: action.payload, loaded: false };
    }

    case TaskInstancesActionTypes.ClearTaskInstances: {
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
