import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  NAME,
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
  State
} from './diabolo-phase.reducer';

export const selectDiaboloPhaseState = createFeatureSelector<State>(NAME);

export const getError = createSelector(
  selectDiaboloPhaseState,
  (state: State) => state.error
);

export const getLoaded = createSelector(
  selectDiaboloPhaseState,
  (state: State) => state.loaded
);

export const getAll = createSelector(selectDiaboloPhaseState, selectAll);

export const getCount = createSelector(selectDiaboloPhaseState, selectTotal);

export const getIds = createSelector(selectDiaboloPhaseState, selectIds);

export const getAllEntities = createSelector(
  selectDiaboloPhaseState,
  selectEntities
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * diaboloPhase$: DiaboloPhaseInterface[] = this.store.pipe(
    select(DiaboloPhaseQueries.getByIds, { ids: [2, 1, 3] })
  );
 */
export const getByIds = createSelector(
  selectDiaboloPhaseState,
  (state: State, props: { ids: number[] }) => {
    return props.ids.map(id => state.entities[id]);
  }
);


/**
 * returns array of objects in the order of the given ids
 * @example
 * diaboloPhase$: DiaboloPhaseInterface = this.store.pipe(
    select(DiaboloPhaseQueries.getById, { id: 3 })
  );
 */
export const getById = createSelector(
  selectDiaboloPhaseState,
  (state: State, props: { id: number }) => state.entities[props.id]
);
