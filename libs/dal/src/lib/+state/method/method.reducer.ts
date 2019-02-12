import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { MethodInterface } from '../../+models';
import { MethodsActions, MethodsActionTypes } from './method.actions';

export const NAME = 'methods';

export interface State extends EntityState<MethodInterface> {
  // additional entities state properties
  loaded: boolean;
  error?: any;
}

export const adapter: EntityAdapter<MethodInterface> = createEntityAdapter<
  MethodInterface
>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  loaded: false
});

export function reducer(state = initialState, action: MethodsActions): State {
  switch (action.type) {
    case MethodsActionTypes.MethodsLoaded: {
      return adapter.addAll(action.payload.methods, { ...state, loaded: true });
    }

    case MethodsActionTypes.MethodsLoadError: {
      return { ...state, error: action.payload, loaded: false };
    }

    case MethodsActionTypes.ClearMethods: {
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
