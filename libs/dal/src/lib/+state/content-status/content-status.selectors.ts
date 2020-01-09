import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  NAME,
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
  State
} from './content-status.reducer';

export const selectContentStatusState = createFeatureSelector<State>(NAME);

export const getError = createSelector(
  selectContentStatusState,
  (state: State) => state.error
);

export const getLoaded = createSelector(
  selectContentStatusState,
  (state: State) => state.loaded
);

export const getAll = createSelector(selectContentStatusState, selectAll);

export const getCount = createSelector(selectContentStatusState, selectTotal);

export const getIds = createSelector(selectContentStatusState, selectIds);

export const getAllEntities = createSelector(
  selectContentStatusState,
  selectEntities
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * contentStatus$: ContentStatusInterface[] = this.store.pipe(
    select(ContentStatusQueries.getByIds, { ids: [2, 1, 3] })
  );
 */
export const getByIds = createSelector(
  selectContentStatusState,
  (state: State, props: { ids: number[] }) => {
    return props.ids.map(id => state.entities[id]);
  }
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * contentStatus$: ContentStatusInterface = this.store.pipe(
    select(ContentStatusQueries.getById, { id: 3 })
  );
 */
export const getById = createSelector(
  selectContentStatusState,
  (state: State, props: { id: number }) => state.entities[props.id]
);
