import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { HistoryInterface } from '../../+models';
import { HistoryActions, HistoryActionTypes } from './history.actions';

export const NAME = 'history';

export interface State extends EntityState<HistoryInterface> {
  // additional entities state properties
  loaded: boolean;
  error?: any;
}

export const adapter: EntityAdapter<HistoryInterface> = createEntityAdapter<
  HistoryInterface
>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  loaded: false
});

export function reducer(state = initialState, action: HistoryActions): State {
  switch (action.type) {
    case HistoryActionTypes.UpsertHistory: {
      return adapter.upsertOne(action.payload.history, state);
    }

    case HistoryActionTypes.DeleteHistory: {
      return adapter.removeOne(action.payload.id, state);
    }

    case HistoryActionTypes.HistoryLoaded: {
      return adapter.addAll(action.payload.history, { ...state, loaded: true });
    }

    case HistoryActionTypes.HistoryLoadError: {
      return { ...state, error: action.payload, loaded: false };
    }

    case HistoryActionTypes.ClearHistory: {
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
