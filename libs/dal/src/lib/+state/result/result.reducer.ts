import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { ResultInterface } from '../../+models';
import { ResultsActions, ResultsActionTypes } from './result.actions';

export const NAME = 'results';

export interface State extends EntityState<ResultInterface> {
  // additional entities state properties
  loaded: boolean;
  error?: any;
}

export const adapter: EntityAdapter<ResultInterface> = createEntityAdapter<
  ResultInterface
>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  loaded: false
});

export function reducer(state = initialState, action: ResultsActions): State {
  switch (action.type) {
    case ResultsActionTypes.AddResult: {
      return adapter.addOne(action.payload.result, state);
    }

    case ResultsActionTypes.UpsertResult: {
      return adapter.upsertOne(action.payload.result, state);
    }

    case ResultsActionTypes.AddResults: {
      return adapter.addMany(action.payload.results, state);
    }

    case ResultsActionTypes.UpsertResults: {
      return adapter.upsertMany(action.payload.results, state);
    }

    case ResultsActionTypes.UpdateResult: {
      return adapter.updateOne(action.payload.result, state);
    }

    case ResultsActionTypes.UpdateResults: {
      return adapter.updateMany(action.payload.results, state);
    }

    case ResultsActionTypes.DeleteResult: {
      return adapter.removeOne(action.payload.id, state);
    }

    case ResultsActionTypes.DeleteResults: {
      return adapter.removeMany(action.payload.ids, state);
    }

    case ResultsActionTypes.ResultsLoaded: {
      return adapter.addAll(action.payload.results, { ...state, loaded: true });
    }

    case ResultsActionTypes.ResultsLoadError: {
      return { ...state, error: action.payload, loaded: false };
    }

    case ResultsActionTypes.ClearResults: {
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
