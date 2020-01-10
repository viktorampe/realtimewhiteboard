import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  NAME,
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
  State
} from './credential.reducer';

export const selectCredentialState = createFeatureSelector<State>(NAME);

export const getError = createSelector(
  selectCredentialState,
  (state: State) => state.error
);

export const getLoaded = createSelector(
  selectCredentialState,
  (state: State) => state.loaded
);

export const getAll = createSelector(selectCredentialState, selectAll);

export const getCount = createSelector(selectCredentialState, selectTotal);

export const getIds = createSelector(selectCredentialState, selectIds);

export const getAllEntities = createSelector(
  selectCredentialState,
  selectEntities
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * credential$: PassportUserCredentialInterface[] = this.store.pipe(
    select(CredentialQueries.getByIds, { ids: [2, 1, 3] })
  );
 */
export const getByIds = createSelector(
  selectCredentialState,
  (state: State, props: { ids: number[] }) => {
    return props.ids.map(id => state.entities[id]);
  }
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * credential$: PassportUserCredentialInterface = this.store.pipe(
    select(CredentialQueries.getById, { id: 3 })
  );
 */
export const getById = createSelector(
  selectCredentialState,
  (state: State, props: { id: number }) => state.entities[props.id]
);
