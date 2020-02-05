import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { UnlockedBoekeGroupInterface } from '../../+models';
import {
  UnlockedBoekeGroupsActions,
  UnlockedBoekeGroupsActionTypes
} from './unlocked-boeke-group.actions';

export const NAME = 'unlockedBoekeGroups';

export interface State extends EntityState<UnlockedBoekeGroupInterface> {
  // additional entities state properties
  loaded: boolean;
  error?: any;
}

export const adapter: EntityAdapter<UnlockedBoekeGroupInterface> = createEntityAdapter<
  UnlockedBoekeGroupInterface
>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  loaded: false
});

export function reducer(
  state = initialState,
  action: UnlockedBoekeGroupsActions
): State {
  switch (action.type) {
    case UnlockedBoekeGroupsActionTypes.AddUnlockedBoekeGroup: {
      return adapter.addOne(action.payload.unlockedBoekeGroup, state);
    }

    case UnlockedBoekeGroupsActionTypes.UpsertUnlockedBoekeGroup: {
      return adapter.upsertOne(action.payload.unlockedBoekeGroup, state);
    }

    case UnlockedBoekeGroupsActionTypes.AddUnlockedBoekeGroups: {
      return adapter.addMany(action.payload.unlockedBoekeGroups, state);
    }

    case UnlockedBoekeGroupsActionTypes.UpsertUnlockedBoekeGroups: {
      return adapter.upsertMany(action.payload.unlockedBoekeGroups, state);
    }

    case UnlockedBoekeGroupsActionTypes.UpdateUnlockedBoekeGroup: {
      return adapter.updateOne(action.payload.unlockedBoekeGroup, state);
    }

    case UnlockedBoekeGroupsActionTypes.UpdateUnlockedBoekeGroups: {
      return adapter.updateMany(action.payload.unlockedBoekeGroups, state);
    }

    case UnlockedBoekeGroupsActionTypes.DeleteUnlockedBoekeGroup: {
      return adapter.removeOne(action.payload.id, state);
    }

    case UnlockedBoekeGroupsActionTypes.DeleteUnlockedBoekeGroups: {
      return adapter.removeMany(action.payload.ids, state);
    }

    case UnlockedBoekeGroupsActionTypes.UnlockedBoekeGroupsLoaded: {
      return adapter.addAll(action.payload.unlockedBoekeGroups, {
        ...state,
        loaded: true
      });
    }

    case UnlockedBoekeGroupsActionTypes.UnlockedBoekeGroupsLoadError: {
      return { ...state, error: action.payload, loaded: false };
    }

    case UnlockedBoekeGroupsActionTypes.ClearUnlockedBoekeGroups: {
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
