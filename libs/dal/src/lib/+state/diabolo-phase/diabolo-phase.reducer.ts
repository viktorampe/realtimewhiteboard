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

export function sortDiaboloPhases(
  a: DiaboloPhaseInterface,
  b: DiaboloPhaseInterface
): number {
  return a.phase - b.phase;
}

export const adapter: EntityAdapter<
  DiaboloPhaseInterface
> = createEntityAdapter<DiaboloPhaseInterface>({
  sortComparer: sortDiaboloPhases
});

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  loaded: false
});

export function reducer(
  state = initialState,
  action: DiaboloPhasesActions
): State {
  switch (action.type) {
    case DiaboloPhasesActionTypes.DiaboloPhasesLoaded: {
      return adapter.addAll(action.payload.diaboloPhases, {
        ...state,
        loaded: true
      });
    }

    case DiaboloPhasesActionTypes.DiaboloPhasesLoadError: {
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
