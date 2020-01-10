import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  NAME,
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
  State
} from './learning-area.reducer';

export const selectLearningAreaState = createFeatureSelector<State>(NAME);

export const getError = createSelector(
  selectLearningAreaState,
  (state: State) => state.error
);

export const getLoaded = createSelector(
  selectLearningAreaState,
  (state: State) => state.loaded
);

export const getAll = createSelector(selectLearningAreaState, selectAll);

export const getCount = createSelector(selectLearningAreaState, selectTotal);

export const getIds = createSelector(selectLearningAreaState, selectIds);

export const getAllEntities = createSelector(
  selectLearningAreaState,
  selectEntities
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * learningArea$: LearningAreaInterface[] = this.store.pipe(
    select(LearningAreaQueries.getByIds, { ids: [2, 1, 3] })
  );
 */
export const getByIds = createSelector(
  selectLearningAreaState,
  (state: State, props: { ids: number[] }) => {
    return props.ids.map(id => state.entities[id]);
  }
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * learningArea$: LearningAreaInterface = this.store.pipe(
    select(LearningAreaQueries.getById, { id: 3 })
  );
 */
export const getById = createSelector(
  selectLearningAreaState,
  (state: State, props: { id: number }) => state.entities[props.id]
);
