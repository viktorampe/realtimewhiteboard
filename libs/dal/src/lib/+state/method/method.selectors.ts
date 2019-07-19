import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MethodInterface } from '../../+models';
import { State as YearState } from '../year/year.reducer';
import { selectYearState } from '../year/year.selectors';
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
 * Utitily to return all entities for the provided ids
 *
 * @param {State} state The method state
 * @param {number[]} ids The ids of the entities you want
 * @returns {MethodInterface[]}
 */
const getMethodsById = (state: State, ids: number[]): MethodInterface[] =>
  ids.map(id => state.entities[id]);

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
    return getMethodsById(state, props.ids);
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

export const getAllowedMethods = createSelector(
  selectMethodState,
  (state: State) => {
    return getMethodsById(state, state.allowedMethods);
  }
);

export const getAllowedMethodIds = createSelector(
  selectMethodState,
  (state: State) => state.allowedMethods
);

export const isAllowedMethod = createSelector(
  selectMethodState,
  (state: State, props: { id: number }) => {
    return state.allowedMethods.some(id => id === props.id);
  }
);

export const getMethodWithYear = createSelector(
  selectMethodState,
  selectYearState,
  (
    methodState: State,
    yearState: YearState,
    props: { methodId: number; yearId: number }
  ) => {
    return (
      methodState.entities[props.methodId].name +
      ' ' +
      yearState.entities[props.yearId].label
    );
  }
);
