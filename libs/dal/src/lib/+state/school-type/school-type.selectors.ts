import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  NAME,
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
  State
} from './school-type.reducer';

export const selectSchoolTypeState = createFeatureSelector<State>(NAME);

export const getError = createSelector(
  selectSchoolTypeState,
  (state: State) => state.error
);

export const getLoaded = createSelector(
  selectSchoolTypeState,
  (state: State) => state.loaded
);

export const getAll = createSelector(selectSchoolTypeState, selectAll);

export const getCount = createSelector(selectSchoolTypeState, selectTotal);

export const getIds = createSelector(selectSchoolTypeState, selectIds);

export const getAllEntities = createSelector(
  selectSchoolTypeState,
  selectEntities
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * schoolType$: SchoolTypeInterface[] = this.store.pipe(
    select(SchoolTypeQueries.getByIds, { ids: [2, 1, 3] })
  );
 */
export const getByIds = createSelector(
  selectSchoolTypeState,
  (state: State, props: { ids: number[] }) => {
    return props.ids.map(id => state.entities[id]);
  }
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * schoolType$: SchoolTypeInterface = this.store.pipe(
    select(SchoolTypeQueries.getById, { id: 3 })
  );
 */
export const getById = createSelector(
  selectSchoolTypeState,
  (state: State, props: { id: number }) => state.entities[props.id]
);
