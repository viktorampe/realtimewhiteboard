import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { UserLessonInterface } from '../../+models';
import {
  UserLessonsActions,
  UserLessonsActionTypes
} from './user-lesson.actions';

export const NAME = 'userLessons';

export interface State extends EntityState<UserLessonInterface> {
  // additional entities state properties
  loaded: boolean;
  error?: any;
}

export const adapter: EntityAdapter<UserLessonInterface> = createEntityAdapter<
  UserLessonInterface
>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  loaded: false
});

export function reducer(
  state = initialState,
  action: UserLessonsActions
): State {
  switch (action.type) {
    case UserLessonsActionTypes.AddUserLesson: {
      return adapter.addOne(action.payload.userLesson, state);
    }

    case UserLessonsActionTypes.UpsertUserLesson: {
      return adapter.upsertOne(action.payload.userLesson, state);
    }

    case UserLessonsActionTypes.AddUserLessons: {
      return adapter.addMany(action.payload.userLessons, state);
    }

    case UserLessonsActionTypes.UpsertUserLessons: {
      return adapter.upsertMany(action.payload.userLessons, state);
    }

    case UserLessonsActionTypes.UpdateUserLesson: {
      return adapter.updateOne(action.payload.userLesson, state);
    }

    case UserLessonsActionTypes.UpdateUserLessons: {
      return adapter.updateMany(action.payload.userLessons, state);
    }

    case UserLessonsActionTypes.DeleteUserLesson: {
      return adapter.removeOne(action.payload.id, state);
    }

    case UserLessonsActionTypes.DeleteUserLessons: {
      return adapter.removeMany(action.payload.ids, state);
    }

    case UserLessonsActionTypes.UserLessonsLoaded: {
      return adapter.addAll(action.payload.userLessons, { ...state, loaded: true });
    }

    case UserLessonsActionTypes.UserLessonsLoadError: {
      return { ...state, error: action.payload, loaded: false };
    }

    case UserLessonsActionTypes.ClearUserLessons: {
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
