import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { UnlockedFreePracticeInterface } from '../../+models';
import {
  UnlockedFreePracticesActions,
  UnlockedFreePracticesActionTypes
} from './unlocked-free-practice.actions';

export const NAME = 'unlockedFreePractices';

export interface State extends EntityState<UnlockedFreePracticeInterface> {
  // additional entities state properties
  loaded: boolean;
  error?: any;
}

export const adapter: EntityAdapter<UnlockedFreePracticeInterface> = createEntityAdapter<
  UnlockedFreePracticeInterface
>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  loaded: false
});

export function reducer(
  state = initialState,
  action: UnlockedFreePracticesActions
): State {
  switch (action.type) {
    case UnlockedFreePracticesActionTypes.AddUnlockedFreePractice: {
      return adapter.addOne(action.payload.unlockedFreePractice, state);
    }

    case UnlockedFreePracticesActionTypes.UpsertUnlockedFreePractice: {
      return adapter.upsertOne(action.payload.unlockedFreePractice, state);
    }

    case UnlockedFreePracticesActionTypes.AddUnlockedFreePractices: {
      return adapter.addMany(action.payload.unlockedFreePractices, state);
    }

    case UnlockedFreePracticesActionTypes.UpsertUnlockedFreePractices: {
      return adapter.upsertMany(action.payload.unlockedFreePractices, state);
    }

    case UnlockedFreePracticesActionTypes.UpdateUnlockedFreePractice: {
      return adapter.updateOne(action.payload.unlockedFreePractice, state);
    }

    case UnlockedFreePracticesActionTypes.UpdateUnlockedFreePractices: {
      return adapter.updateMany(action.payload.unlockedFreePractices, state);
    }

    case UnlockedFreePracticesActionTypes.DeleteUnlockedFreePractice: {
      return adapter.removeOne(action.payload.id, state);
    }

    case UnlockedFreePracticesActionTypes.DeleteUnlockedFreePractices: {
      return adapter.removeMany(action.payload.ids, state);
    }

    case UnlockedFreePracticesActionTypes.UnlockedFreePracticesLoaded: {
      return adapter.addAll(action.payload.unlockedFreePractices, {
        ...state,
        loaded: true
      });
    }

    case UnlockedFreePracticesActionTypes.UnlockedFreePracticesLoadError: {
      return { ...state, error: action.payload, loaded: false };
    }

    case UnlockedFreePracticesActionTypes.ClearUnlockedFreePractices: {
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
