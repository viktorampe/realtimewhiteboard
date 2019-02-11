import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { MethodInterface } from '../../+models';
import {
  MethodsActions,
  MethodsActionTypes
} from './method.actions';

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

export function reducer(
  state = initialState,
  action: MethodsActions
): State {
  switch (action.type) {
    case MethodsActionTypes.AddMethod: {
      return adapter.addOne(action.payload.method, state);
    }

    case MethodsActionTypes.UpsertMethod: {
      return adapter.upsertOne(action.payload.method, state);
    }

    case MethodsActionTypes.AddMethods: {
      return adapter.addMany(action.payload.methods, state);
    }

    case MethodsActionTypes.UpsertMethods: {
      return adapter.upsertMany(action.payload.methods, state);
    }

    case MethodsActionTypes.UpdateMethod: {
      return adapter.updateOne(action.payload.method, state);
    }

    case MethodsActionTypes.UpdateMethods: {
      return adapter.updateMany(action.payload.methods, state);
    }

    case MethodsActionTypes.DeleteMethod: {
      return adapter.removeOne(action.payload.id, state);
    }

    case MethodsActionTypes.DeleteMethods: {
      return adapter.removeMany(action.payload.ids, state);
    }

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
