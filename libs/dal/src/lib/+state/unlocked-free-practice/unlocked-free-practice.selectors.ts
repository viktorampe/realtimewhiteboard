import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  NAME,
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
  State
} from './unlocked-free-practice.reducer';

export const selectUnlockedFreePracticeState = createFeatureSelector<State>(
  NAME
);

export const getError = createSelector(
  selectUnlockedFreePracticeState,
  (state: State) => state.error
);

export const getLoaded = createSelector(
  selectUnlockedFreePracticeState,
  (state: State) => state.loaded
);

export const getAll = createSelector(
  selectUnlockedFreePracticeState,
  selectAll
);

export const getCount = createSelector(
  selectUnlockedFreePracticeState,
  selectTotal
);

export const getIds = createSelector(
  selectUnlockedFreePracticeState,
  selectIds
);

export const getAllEntities = createSelector(
  selectUnlockedFreePracticeState,
  selectEntities
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * unlockedFreePractice$: UnlockedFreePracticeInterface[] = this.store.pipe(
    select(UnlockedFreePracticeQueries.getByIds, { ids: [2, 1, 3] })
  );
 */
export const getByIds = createSelector(
  selectUnlockedFreePracticeState,
  (state: State, props: { ids: number[] }) => {
    return props.ids.map(id => state.entities[id]);
  }
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * unlockedFreePractice$: UnlockedFreePracticeInterface = this.store.pipe(
    select(UnlockedFreePracticeQueries.getById, { id: 3 })
  );
 */
export const getById = createSelector(
  selectUnlockedFreePracticeState,
  (state: State, props: { id: number }) => state.entities[props.id]
);
