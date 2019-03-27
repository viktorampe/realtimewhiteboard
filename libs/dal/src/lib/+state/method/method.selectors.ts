import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  NAME,
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
  State
} from './method.reducer';

export const selectMethodState = createFeatureSelector<State>(NAME);

export const getError = createSelector(
  selectMethodState,
  (state: State) => state.error
);

export const getLoaded = createSelector(
  selectMethodState,
  (state: State) => state.loaded
);

export const getAll = createSelector(
  selectMethodState,
  selectAll
);

export const getCount = createSelector(
  selectMethodState,
  selectTotal
);

export const getIds = createSelector(
  selectMethodState,
  selectIds
);

export const getAllEntities = createSelector(
  selectMethodState,
  selectEntities
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * method$: MethodInterface[] = this.store.pipe(
    select(MethodQueries.getByIds, { ids: [2, 1, 3] })
  );
 */
export const getByIds = createSelector(
  selectMethodState,
  (state: State, props: { ids: number[] }) => {
    return props.ids.map(id => state.entities[id]);
  }
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * method$: MethodInterface = this.store.pipe(
    select(MethodQueries.getById, { id: 3 })
  );
 */
export const getById = createSelector(
  selectMethodState,
  (state: State, props: { id: number }) => state.entities[props.id]
);

/**
 * returns array of objects filtered by learning area id as key
 */
export const getByLearningAreaId = createSelector(
  selectMethodState,
  (state: State, props: { learningAreaId: number }) => {
    return Object.values(state.entities).filter(
      method => method.learningAreaId === props.learningAreaId
    );
  }
);

/**
 * returns array of objects filtered by learning area ids as key
 */
export const getByLearningAreaIds = createSelector(
  selectMethodState,
  (state: State, props: { learningAreaIds: number[] }) => {
    return Object.values(state.entities).filter(method =>
      props.learningAreaIds.some(
        learningAreaId => method.learningAreaId === learningAreaId
      )
    );
  }
);
