import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { TaskEduContentInterface } from '../../+models';
import {
  TaskEduContentsActions,
  TaskEduContentsActionTypes
} from './task-edu-content.actions';

export const NAME = 'taskEduContents';

const sortByIndex = (
  a: TaskEduContentInterface,
  b: TaskEduContentInterface
): number => a.index - b.index || a.id - b.id; // if index is equal, sort by id asc

export interface State extends EntityState<TaskEduContentInterface> {
  // additional entities state properties
  loaded: boolean;
  error?: any;
}

export const adapter: EntityAdapter<TaskEduContentInterface> = createEntityAdapter<
  TaskEduContentInterface
>({
  sortComparer: sortByIndex
});

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  loaded: false
});

export function reducer(
  state = initialState,
  action: TaskEduContentsActions
): State {
  switch (action.type) {
    case TaskEduContentsActionTypes.AddTaskEduContent: {
      return adapter.addOne(action.payload.taskEduContent, state);
    }

    case TaskEduContentsActionTypes.UpsertTaskEduContent: {
      return adapter.upsertOne(action.payload.taskEduContent, state);
    }

    case TaskEduContentsActionTypes.AddTaskEduContents: {
      return adapter.addMany(action.payload.taskEduContents, state);
    }

    case TaskEduContentsActionTypes.UpsertTaskEduContents: {
      return adapter.upsertMany(action.payload.taskEduContents, state);
    }

    case TaskEduContentsActionTypes.UpdateTaskEduContent: {
      return adapter.updateOne(action.payload.taskEduContent, state);
    }

    case TaskEduContentsActionTypes.UpdateTaskEduContents: {
      return adapter.updateMany(action.payload.taskEduContents, state);
    }

    case TaskEduContentsActionTypes.DeleteTaskEduContent: {
      return adapter.removeOne(action.payload.id, state);
    }

    case TaskEduContentsActionTypes.DeleteTaskEduContents: {
      return adapter.removeMany(action.payload.ids, state);
    }

    case TaskEduContentsActionTypes.TaskEduContentsLoaded: {
      return adapter.addAll(action.payload.taskEduContents, {
        ...state,
        loaded: true
      });
    }

    case TaskEduContentsActionTypes.TaskEduContentsLoadError: {
      return { ...state, error: action.payload, loaded: false };
    }

    case TaskEduContentsActionTypes.ClearTaskEduContents: {
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
