import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
  State
} from './bundle.reducer';

export const selectBundleState = createFeatureSelector<State>('bundles');

export const getError = createSelector(
  selectBundleState,
  (state: State) => state.error
);

export const getLoaded = createSelector(
  selectBundleState,
  (state: State) => state.loaded
);

export const getAll = createSelector(selectBundleState, selectAll);

export const getCount = createSelector(selectBundleState, selectTotal);

export const getIds = createSelector(selectBundleState, selectIds);

export const getAllEntities = createSelector(selectBundleState, selectEntities);

/**
 * returns array of objects in the order of the given ids
 * @example
 * bundle$: BundleInterface[] = this.store.pipe(
    select(BundleQueries.getByIds, { ids: [2, 1, 3] })
  );
 */
export const getByIds = createSelector(
  selectBundleState,
  (state: State, props: { ids: number[] }) => {
    return props.ids.map(id => state.entities[id]);
  }
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * bundle$: BundleInterface = this.store.pipe(
    select(BundleQueries.getById, { id: 3 })
  );
 */
export const getById = createSelector(
  selectBundleState,
  (state: State, props: { id: number }) => state.entities[props.id]
);

export const getByLearningAreaIds = createSelector(
  selectBundleState,
  (state: State, props: { ids: number[] }) => {
    const byKey = {};
    props.ids.forEach(id => {
      const item = state.entities[id];
      if (!byKey[item.learningAreaId]) {
        byKey[item.learningAreaId] = [];
      }
      byKey[item.learningAreaId].push(item);
    });
    return byKey;
  }
);
