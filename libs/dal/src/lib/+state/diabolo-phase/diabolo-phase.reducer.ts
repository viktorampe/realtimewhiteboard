import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { DiaboloPhaseInterface } from '../../+models';
import {
  DiaboloPhasesActions,
  DiaboloPhasesActionTypes
} from './diabolo-phase.actions';

export const NAME = 'diaboloPhases';

export interface State extends EntityState<DiaboloPhaseInterface> {
  // additional entities state properties
  loaded: boolean;
  error?: any;
}

export const adapter: EntityAdapter<DiaboloPhaseInterface> = createEntityAdapter<
  DiaboloPhaseInterface
>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  loaded: false
});

export function reducer(
  state = initialState,
  action: DiaboloPhasesActions
): State {
  switch (action.type) {
    case DiaboloPhasesActionTypes.AddDiaboloPhase: {
      return adapter.addOne(action.payload.diaboloPhase, state);
    }

    case DiaboloPhasesActionTypes.UpsertDiaboloPhase: {
      return adapter.upsertOne(action.payload.diaboloPhase, state);
    }

    case DiaboloPhasesActionTypes.AddDiaboloPhases: {
      return adapter.addMany(action.payload.diaboloPhases, state);
    }

    case DiaboloPhasesActionTypes.UpsertDiaboloPhases: {
      return adapter.upsertMany(action.payload.diaboloPhases, state);
    }

    case DiaboloPhasesActionTypes.UpdateDiaboloPhase: {
      return adapter.updateOne(action.payload.diaboloPhase, state);
    }

    case DiaboloPhasesActionTypes.UpdateDiaboloPhases: {
      return adapter.updateMany(action.payload.diaboloPhases, state);
    }

    case DiaboloPhasesActionTypes.DeleteDiaboloPhase: {
      return adapter.removeOne(action.payload.id, state);
    }

    case DiaboloPhasesActionTypes.DeleteDiaboloPhases: {
      return adapter.removeMany(action.payload.ids, state);
    }

    case DiaboloPhasesActionTypes.DiaboloPhasesLoaded: {
      return adapter.addAll(action.payload.diaboloPhases, { ...state, loaded: true });
    }

    case DiaboloPhasesActionTypes.DiaboloPhasesLoadError: {
      return { ...state, error: action.payload, loaded: false };
    }

    case DiaboloPhasesActionTypes.ClearDiaboloPhases: {
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
