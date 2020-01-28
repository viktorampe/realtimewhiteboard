import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  NAME,
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
  State
} from './learning-domain.reducer';

export const selectLearningDomainState = createFeatureSelector<State>(NAME);

export const getError = createSelector(
  selectLearningDomainState,
  (state: State) => state.error
);

export const getLoaded = createSelector(
  selectLearningDomainState,
  (state: State) => state.loaded
);

export const getAll = createSelector(selectLearningDomainState, selectAll);

export const getCount = createSelector(selectLearningDomainState, selectTotal);

export const getIds = createSelector(selectLearningDomainState, selectIds);

export const getAllEntities = createSelector(
  selectLearningDomainState,
  selectEntities
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * learningDomain$: LearningDomainInterface[] = this.store.pipe(
    select(LearningDomainQueries.getByIds, { ids: [2, 1, 3] })
  );
 */
export const getByIds = createSelector(
  selectLearningDomainState,
  (state: State, props: { ids: number[] }) => {
    return props.ids.map(id => state.entities[id]);
  }
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * learningDomain$: LearningDomainInterface = this.store.pipe(
    select(LearningDomainQueries.getById, { id: 3 })
  );
 */
export const getById = createSelector(
  selectLearningDomainState,
  (state: State, props: { id: number }) => state.entities[props.id]
);

export const getByLearningArea = createSelector(
  selectLearningDomainState,
  (state: State, props: { learningAreaId: Number }) => {
    return (<number[]>state.ids)
      .filter(id => state.entities[id].learningAreaId === props.learningAreaId)
      .map(id => state.entities[id]);
  }
);
export const getByLearningAreas = createSelector(
  selectLearningDomainState,
  (state: State, props: { learningAreaIds: Number[] }) => {
    return (<number[]>state.ids)
      .filter(id =>
        props.learningAreaIds.some(
          learningAreaId => state.entities[id].learningAreaId === learningAreaId
        )
      )
      .map(id => state.entities[id]);
  }
);
