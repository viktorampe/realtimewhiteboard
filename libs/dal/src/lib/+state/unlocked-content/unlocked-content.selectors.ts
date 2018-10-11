import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  selectAll, 
  selectEntities,
  selectIds,
  selectTotal,
  State } from './unlocked-content.reducer';

export const selectUnlockedContentState = createFeatureSelector<State>(
  'unlockedContents'
);

export const getError = createSelector(
  selectUnlockedContentState,
  (state: State) => state.error
);

export const getLoaded = createSelector(
  selectUnlockedContentState,
  (state: State) => state.loaded
);

export const getAll = createSelector(selectUnlockedContentState, selectAll);

export const getCount = createSelector(selectUnlockedContentState, selectTotal);

export const getIds = createSelector(selectUnlockedContentState, selectIds);

export const getAllEntities = createSelector(
  selectUnlockedContentState,
  selectEntities
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * unlockedContent$: UnlockedContentInterface[] = this.store.pipe(
    select(UnlockedContentQueries.getByIds, { ids: [2, 1, 3] })
  );
 */
export const getByIds = createSelector(
  selectUnlockedContentState,
  (state: State, props: { ids: number[] }) => {
    return props.ids.map(id => state.entities[id]);
  }
);


/**
 * returns array of objects in the order of the given ids
 * @example
 * unlockedContent$: UnlockedContentInterface = this.store.pipe(
    select(UnlockedContentQueries.getById, { id: 3 })
  );
 */
export const getById = createSelector(
  selectUnlockedContentState,
  (state: State, props: { id: number }) => state.entities[props.id]
);
