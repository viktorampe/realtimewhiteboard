import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  NAME,
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
  State
} from './person.reducer';

export const selectPersonState = createFeatureSelector<State>(NAME);

export const getError = createSelector(
  selectPersonState,
  (state: State) => state.error
);

export const getLoaded = createSelector(
  selectPersonState,
  (state: State) => state.loaded
);

export const getAll = createSelector(selectPersonState, selectAll);

export const getCount = createSelector(selectPersonState, selectTotal);

export const getIds = createSelector(selectPersonState, selectIds);

export const getAllEntities = createSelector(
  selectPersonState,
  selectEntities
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * person$: PersonInterface[] = this.store.pipe(
    select(PersonQueries.getByIds, { ids: [2, 1, 3] })
  );
 */
export const getByIds = createSelector(
  selectPersonState,
  (state: State, props: { ids: number[] }) => {
    return props.ids.map(id => state.entities[id]);
  }
);


/**
 * returns array of objects in the order of the given ids
 * @example
 * person$: PersonInterface = this.store.pipe(
    select(PersonQueries.getById, { id: 3 })
  );
 */
export const getById = createSelector(
  selectPersonState,
  (state: State, props: { id: number }) => state.entities[props.id]
);
