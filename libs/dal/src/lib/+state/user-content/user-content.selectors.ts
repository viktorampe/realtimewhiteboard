import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserContent, UserContentInterface } from '../../+models';
import {
  NAME,
  selectAll,
  selectIds,
  selectTotal,
  State
} from './user-content.reducer';

export const selectUserContentState = createFeatureSelector<State>(NAME);

export const getError = createSelector(
  selectUserContentState,
  (state: State) => state.error
);

export const getLoaded = createSelector(
  selectUserContentState,
  (state: State) => state.loaded
);

export const getAll = createSelector(selectUserContentState, selectAll);

export const getCount = createSelector(selectUserContentState, selectTotal);

export const getIds = createSelector(selectUserContentState, selectIds);

export const getAllEntities = createSelector(
  selectUserContentState,
  (state: State) => {
    return (<number[]>state.ids).reduce((acc, id) => {
      acc[id] = asUserContent(state.entities[id]);
      return acc;
    }, {});
  }
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * userContent$: UserContentInterface[] = this.store.pipe(
    select(UserContentQueries.getByIds, { ids: [2, 1, 3] })
  );
 */
export const getByIds = createSelector(
  selectUserContentState,
  (state: State, props: { ids: number[] }) => {
    return props.ids.map(id => asUserContent(state.entities[id]));
  }
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * userContent$: UserContentInterface = this.store.pipe(
    select(UserContentQueries.getById, { id: 3 })
  );
 */
export const getById = createSelector(
  selectUserContentState,
  (state: State, props: { id: number }) =>
    asUserContent(state.entities[props.id])
);

function asUserContent(item: UserContentInterface): UserContent {
  if (item) {
    return Object.assign<UserContent, UserContentInterface>(
      new UserContent(),
      item
    );
  }
}
