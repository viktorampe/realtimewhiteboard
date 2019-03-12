import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { SchoolTypeInterface } from '../../+models';
import {
  SchoolTypesActions,
  SchoolTypesActionTypes
} from './school-type.actions';

export const NAME = 'schoolTypes';

export interface State extends EntityState<SchoolTypeInterface> {
  // additional entities state properties
  loaded: boolean;
  error?: any;
}

export const adapter: EntityAdapter<SchoolTypeInterface> = createEntityAdapter<
  SchoolTypeInterface
>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  loaded: false
});

export function reducer(
  state = initialState,
  action: SchoolTypesActions
): State {
  switch (action.type) {
    case SchoolTypesActionTypes.AddSchoolType: {
      return adapter.addOne(action.payload.schoolType, state);
    }

    case SchoolTypesActionTypes.UpsertSchoolType: {
      return adapter.upsertOne(action.payload.schoolType, state);
    }

    case SchoolTypesActionTypes.AddSchoolTypes: {
      return adapter.addMany(action.payload.schoolTypes, state);
    }

    case SchoolTypesActionTypes.UpsertSchoolTypes: {
      return adapter.upsertMany(action.payload.schoolTypes, state);
    }

    case SchoolTypesActionTypes.UpdateSchoolType: {
      return adapter.updateOne(action.payload.schoolType, state);
    }

    case SchoolTypesActionTypes.UpdateSchoolTypes: {
      return adapter.updateMany(action.payload.schoolTypes, state);
    }

    case SchoolTypesActionTypes.DeleteSchoolType: {
      return adapter.removeOne(action.payload.id, state);
    }

    case SchoolTypesActionTypes.DeleteSchoolTypes: {
      return adapter.removeMany(action.payload.ids, state);
    }

    case SchoolTypesActionTypes.SchoolTypesLoaded: {
      return adapter.addAll(action.payload.schoolTypes, { ...state, loaded: true });
    }

    case SchoolTypesActionTypes.SchoolTypesLoadError: {
      return { ...state, error: action.payload, loaded: false };
    }

    case SchoolTypesActionTypes.ClearSchoolTypes: {
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
