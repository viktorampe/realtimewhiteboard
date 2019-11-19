import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { MethodLevelInterface } from '../../+models';
import {
  MethodLevelsActions,
  MethodLevelsActionTypes
} from './method-level.actions';

export const NAME = 'methodLevels';

export interface State extends EntityState<MethodLevelInterface> {
  // additional entities state properties
  loaded: boolean;
  error?: any;
}

export const adapter: EntityAdapter<MethodLevelInterface> = createEntityAdapter<
  MethodLevelInterface
>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  loaded: false
});

export function reducer(
  state = initialState,
  action: MethodLevelsActions
): State {
  switch (action.type) {
    case MethodLevelsActionTypes.AddMethodLevel: {
      return adapter.addOne(action.payload.methodLevel, state);
    }

    case MethodLevelsActionTypes.UpsertMethodLevel: {
      return adapter.upsertOne(action.payload.methodLevel, state);
    }

    case MethodLevelsActionTypes.AddMethodLevels: {
      return adapter.addMany(action.payload.methodLevels, state);
    }

    case MethodLevelsActionTypes.UpsertMethodLevels: {
      return adapter.upsertMany(action.payload.methodLevels, state);
    }

    case MethodLevelsActionTypes.UpdateMethodLevel: {
      return adapter.updateOne(action.payload.methodLevel, state);
    }

    case MethodLevelsActionTypes.UpdateMethodLevels: {
      return adapter.updateMany(action.payload.methodLevels, state);
    }

    case MethodLevelsActionTypes.DeleteMethodLevel: {
      return adapter.removeOne(action.payload.id, state);
    }

    case MethodLevelsActionTypes.DeleteMethodLevels: {
      return adapter.removeMany(action.payload.ids, state);
    }

    case MethodLevelsActionTypes.MethodLevelsLoaded: {
      return adapter.addAll(action.payload.methodLevels, { ...state, loaded: true });
    }

    case MethodLevelsActionTypes.MethodLevelsLoadError: {
      return { ...state, error: action.payload, loaded: false };
    }

    case MethodLevelsActionTypes.ClearMethodLevels: {
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
