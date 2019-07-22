import { createFeatureSelector, createSelector } from '@ngrx/store';
import { EduContentBookInterface, MethodInterface } from '../../+models';
import { getAll as getAllEduContentBooks } from '../edu-content-book/edu-content-book.selectors';
import { State as YearState } from '../year/year.reducer';
import { selectYearState } from '../year/year.selectors';
import {
  MethodYearsInterface,
  MethodYearsKeyValueObject,
  MethodYearValueObject
} from './method.interfaces';
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
 * Utility to return all entities for the provided ids
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

export const getAllowedMethodsLoaded = createSelector(
  selectMethodState,
  (state: State) => {
    return state.allowedMethodsLoaded;
  }
);

export const getAllowedMethodIds = createSelector(
  selectMethodState,
  (state: State) => state.allowedMethods
);

export const getAllowedMethods = createSelector(
  selectMethodState,
  getIds,
  getAllowedMethodIds,
  (state: State, stateIds: number[], allowedMethodIds: number[]) => {
    // order allowed method ids like in the state.ids property
    allowedMethodIds = stateIds.filter(id => {
      return allowedMethodIds.includes(id);
    });

    return getMethodsById(state, allowedMethodIds);
  }
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

export const getMethodYears = createSelector(
  getAllowedMethodIds,
  getAllEduContentBooks,
  (
    allowedMethodIds: number[],
    eduContentBooks: EduContentBookInterface[]
  ): MethodYearsInterface[] => {
    return Object.entries(
      eduContentBooks
        .filter(book => allowedMethodIds.includes(book.methodId))
        .reduce((agg, book): MethodYearsKeyValueObject => {
          if (!agg[book.methodId])
            agg[book.methodId] = {
              logoUrl: book.method.logoUrl,
              name: book.method.name,
              years: []
            };
          if (book.years.length > 0)
            agg[book.methodId].years.push({
              name: book.years[0].name,
              id: book.years[0].id,
              bookId: book.id
            });
          return agg;
        }, {})
    ).reduce(
      (
        agg: MethodYearsInterface[],
        methodYearEntry: [string, MethodYearValueObject]
      ) => {
        agg.push({ id: +methodYearEntry[0], ...methodYearEntry[1] });
        return agg;
      },
      []
    );
  }
);
