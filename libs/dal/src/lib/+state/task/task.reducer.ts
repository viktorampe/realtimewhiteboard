import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { TaskInterface } from '../../+models';
import { TasksActions, TasksActionTypes } from './task.actions';

export const NAME = 'tasks';

export interface State extends EntityState<TaskInterface> {
  // additional entities state properties
  loaded: boolean;
  error?: any;
}

export const adapter: EntityAdapter<TaskInterface> = createEntityAdapter<
  TaskInterface
>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  loaded: false
});

export function reducer(state = initialState, action: TasksActions): State {
  switch (action.type) {
    case TasksActionTypes.AddTask: {
      return adapter.addOne(action.payload.task, state);
    }

    case TasksActionTypes.UpsertTask: {
      return adapter.upsertOne(action.payload.task, state);
    }

    case TasksActionTypes.AddTasks: {
      return adapter.addMany(action.payload.tasks, state);
    }

    case TasksActionTypes.UpsertTasks: {
      return adapter.upsertMany(action.payload.tasks, state);
    }

    case TasksActionTypes.UpdateTask: {
      return adapter.updateOne(action.payload.task, state);
    }

    case TasksActionTypes.UpdateTasks: {
      return adapter.updateMany(action.payload.tasks, state);
    }

    case TasksActionTypes.DeleteTask: {
      return adapter.removeOne(action.payload.id, state);
    }

    case TasksActionTypes.DeleteTasks: {
      return adapter.removeMany(action.payload.ids, state);
    }

    case TasksActionTypes.TasksLoaded: {
      return adapter.addAll(action.payload.tasks, { ...state, loaded: true });
    }

    case TasksActionTypes.TasksLoadError: {
      return { ...state, error: action.payload, loaded: false };
    }

    case TasksActionTypes.ClearTasks: {
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
