import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { MethodInterface } from '../../+models';
import { MethodsActions, MethodsActionTypes } from './method.actions';

export const NAME = 'methods';

export interface State extends EntityState<MethodInterface> {
  // additional entities state properties
  allowedMethods: number[];
  allowedMethodsLoaded: boolean;
  loaded: boolean;
  error?: any;
}

export const adapter: EntityAdapter<MethodInterface> = createEntityAdapter<
  MethodInterface
>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  allowedMethods: [],
  allowedMethodsLoaded: false,
  loaded: false
});

export function reducer(state = initialState, action: MethodsActions): State {
  switch (action.type) {
    case MethodsActionTypes.MethodsLoaded: {
      return adapter.addAll(action.payload.methods, { ...state, loaded: true });
    }

    case MethodsActionTypes.AllowedMethodsLoaded: {
      return {
        ...state,
        allowedMethods: [...state.allowedMethods, ...action.payload.methodIds],
        allowedMethodsLoaded: true
      };
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
