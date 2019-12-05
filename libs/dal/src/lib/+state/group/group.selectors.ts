import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  NAME,
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
  State
} from './group.reducer';

export const selectGroupState = createFeatureSelector<State>(NAME);

export const getError = createSelector(
  selectGroupState,
  (state: State) => state.error
);

export const getLoaded = createSelector(
  selectGroupState,
  (state: State) => state.loaded
);

export const getAll = createSelector(selectGroupState, selectAll);

export const getCount = createSelector(selectGroupState, selectTotal);

export const getIds = createSelector(selectGroupState, selectIds);

export const getAllEntities = createSelector(
  selectGroupState,
  selectEntities
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * group$: GroupInterface[] = this.store.pipe(
    select(GroupQueries.getByIds, { ids: [2, 1, 3] })
  );
 */
export const getByIds = createSelector(
  selectGroupState,
  (state: State, props: { ids: number[] }) => {
    return props.ids.map(id => state.entities[id]);
  }
);


/**
 * returns array of objects in the order of the given ids
 * @example
 * group$: GroupInterface = this.store.pipe(
    select(GroupQueries.getById, { id: 3 })
  );
 */
export const getById = createSelector(
  selectGroupState,
  (state: State, props: { id: number }) => state.entities[props.id]
);
