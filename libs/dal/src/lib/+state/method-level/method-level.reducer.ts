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
    case MethodLevelsActionTypes.MethodLevelsLoaded: {
      return adapter.addAll(action.payload.methodLevels, {
        ...state,
        loaded: true
      });
    }

    case MethodLevelsActionTypes.MethodLevelsLoadError: {
      return { ...state, error: action.payload, loaded: false };
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
