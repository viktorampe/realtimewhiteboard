import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { YearInterface } from '../../+models';
import {
  YearsActions,
  YearsActionTypes
} from './year.actions';

export const NAME = 'years';

export interface State extends EntityState<YearInterface> {
  // additional entities state properties
  loaded: boolean;
  error?: any;
}

export const adapter: EntityAdapter<YearInterface> = createEntityAdapter<
  YearInterface
>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  loaded: false
});

export function reducer(
  state = initialState,
  action: YearsActions
): State {
  switch (action.type) {
    case YearsActionTypes.AddYear: {
      return adapter.addOne(action.payload.year, state);
    }

    case YearsActionTypes.UpsertYear: {
      return adapter.upsertOne(action.payload.year, state);
    }

    case YearsActionTypes.AddYears: {
      return adapter.addMany(action.payload.years, state);
    }

    case YearsActionTypes.UpsertYears: {
      return adapter.upsertMany(action.payload.years, state);
    }

    case YearsActionTypes.UpdateYear: {
      return adapter.updateOne(action.payload.year, state);
    }

    case YearsActionTypes.UpdateYears: {
      return adapter.updateMany(action.payload.years, state);
    }

    case YearsActionTypes.DeleteYear: {
      return adapter.removeOne(action.payload.id, state);
    }

    case YearsActionTypes.DeleteYears: {
      return adapter.removeMany(action.payload.ids, state);
    }

    case YearsActionTypes.YearsLoaded: {
      return adapter.addAll(action.payload.years, { ...state, loaded: true });
    }

    case YearsActionTypes.YearsLoadError: {
      return { ...state, error: action.payload, loaded: false };
    }

    case YearsActionTypes.ClearYears: {
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
