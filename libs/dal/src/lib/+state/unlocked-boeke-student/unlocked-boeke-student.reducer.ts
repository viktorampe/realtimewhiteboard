import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { UnlockedBoekeStudentInterface } from '../../+models';
import {
  UnlockedBoekeStudentsActions,
  UnlockedBoekeStudentsActionTypes
} from './unlocked-boeke-student.actions';

export const NAME = 'unlockedBoekeStudents';

export interface State extends EntityState<UnlockedBoekeStudentInterface> {
  // additional entities state properties
  loaded: boolean;
  error?: any;
}

export const adapter: EntityAdapter<UnlockedBoekeStudentInterface> = createEntityAdapter<
  UnlockedBoekeStudentInterface
>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  loaded: false
});

export function reducer(
  state = initialState,
  action: UnlockedBoekeStudentsActions
): State {
  switch (action.type) {
    case UnlockedBoekeStudentsActionTypes.AddUnlockedBoekeStudent: {
      return adapter.addOne(action.payload.unlockedBoekeStudent, state);
    }

    case UnlockedBoekeStudentsActionTypes.UpsertUnlockedBoekeStudent: {
      return adapter.upsertOne(action.payload.unlockedBoekeStudent, state);
    }

    case UnlockedBoekeStudentsActionTypes.AddUnlockedBoekeStudents: {
      return adapter.addMany(action.payload.unlockedBoekeStudents, state);
    }

    case UnlockedBoekeStudentsActionTypes.UpsertUnlockedBoekeStudents: {
      return adapter.upsertMany(action.payload.unlockedBoekeStudents, state);
    }

    case UnlockedBoekeStudentsActionTypes.UpdateUnlockedBoekeStudent: {
      return adapter.updateOne(action.payload.unlockedBoekeStudent, state);
    }

    case UnlockedBoekeStudentsActionTypes.UpdateUnlockedBoekeStudents: {
      return adapter.updateMany(action.payload.unlockedBoekeStudents, state);
    }

    case UnlockedBoekeStudentsActionTypes.DeleteUnlockedBoekeStudent: {
      return adapter.removeOne(action.payload.id, state);
    }

    case UnlockedBoekeStudentsActionTypes.DeleteUnlockedBoekeStudents: {
      return adapter.removeMany(action.payload.ids, state);
    }

    case UnlockedBoekeStudentsActionTypes.UnlockedBoekeStudentsLoaded: {
      return adapter.addAll(action.payload.unlockedBoekeStudents, {
        ...state,
        loaded: true
      });
    }

    case UnlockedBoekeStudentsActionTypes.UnlockedBoekeStudentsLoadError: {
      return { ...state, error: action.payload, loaded: false };
    }

    case UnlockedBoekeStudentsActionTypes.ClearUnlockedBoekeStudents: {
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
