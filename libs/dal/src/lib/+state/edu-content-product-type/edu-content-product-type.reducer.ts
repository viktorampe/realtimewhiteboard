import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { EduContentProductTypeInterface } from '../../+models';
import {
  EduContentProductTypesActions,
  EduContentProductTypesActionTypes
} from './edu-content-product-type.actions';

export const NAME = 'eduContentProductTypes';

export interface State extends EntityState<EduContentProductTypeInterface> {
  // additional entities state properties
  loaded: boolean;
  error?: any;
}

export const adapter: EntityAdapter<EduContentProductTypeInterface> = createEntityAdapter<
  EduContentProductTypeInterface
>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  loaded: false
});

export function reducer(
  state = initialState,
  action: EduContentProductTypesActions
): State {
  switch (action.type) {
    case EduContentProductTypesActionTypes.AddEduContentProductType: {
      return adapter.addOne(action.payload.eduContentProductType, state);
    }

    case EduContentProductTypesActionTypes.UpsertEduContentProductType: {
      return adapter.upsertOne(action.payload.eduContentProductType, state);
    }

    case EduContentProductTypesActionTypes.AddEduContentProductTypes: {
      return adapter.addMany(action.payload.eduContentProductTypes, state);
    }

    case EduContentProductTypesActionTypes.UpsertEduContentProductTypes: {
      return adapter.upsertMany(action.payload.eduContentProductTypes, state);
    }

    case EduContentProductTypesActionTypes.UpdateEduContentProductType: {
      return adapter.updateOne(action.payload.eduContentProductType, state);
    }

    case EduContentProductTypesActionTypes.UpdateEduContentProductTypes: {
      return adapter.updateMany(action.payload.eduContentProductTypes, state);
    }

    case EduContentProductTypesActionTypes.DeleteEduContentProductType: {
      return adapter.removeOne(action.payload.id, state);
    }

    case EduContentProductTypesActionTypes.DeleteEduContentProductTypes: {
      return adapter.removeMany(action.payload.ids, state);
    }

    case EduContentProductTypesActionTypes.EduContentProductTypesLoaded: {
      return adapter.addAll(action.payload.eduContentProductTypes, {
        ...state,
        loaded: true
      });
    }

    case EduContentProductTypesActionTypes.EduContentProductTypesLoadError: {
      return { ...state, error: action.payload, loaded: false };
    }

    case EduContentProductTypesActionTypes.ClearEduContentProductTypes: {
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
