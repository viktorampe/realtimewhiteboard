import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
  State
} from './alert.reducer';

export const selectAlertState = createFeatureSelector<State>('alerts');

export const getError = createSelector(
  selectAlertState,
  (state: State) => state.error
);

export const getLoaded = createSelector(
  selectAlertState,
  (state: State) => state.loaded
);

export const getAll = createSelector(selectAlertState, selectAll);

export const getCount = createSelector(selectAlertState, selectTotal);

export const getIds = createSelector(selectAlertState, selectIds);

export const getAllEntities = createSelector(selectAlertState, selectEntities);

/**
 * returns array of objects in the order of the given ids
 * @example
 * alert$: AlertQueueInterface[] = this.store.pipe(
    select(AlertQueries.getByIds, { ids: [2, 1, 3] })
  );
 */
export const getByIds = createSelector(
  selectAlertState,
  (state: State, props: { ids: number[] }) => {
    return props.ids.map(id => state.entities[id]);
  }
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * alert$: AlertQueueInterface = this.store.pipe(
    select(AlertQueries.getById, { id: 3 })
  );
 */
export const getById = createSelector(
  selectAlertState,
  (state: State, props: { id: number }) => state.entities[props.id]
);

export const getUnread = createSelector(selectAlertState, (state: State) =>
  state.entities.filter(alert => alert.read)
);

export const getRecent = createSelector(
  selectAlertState,
  (state: State, props: { timeThreshold: Date }) =>
    state.entities.filter(alert => alert.validFrom >= props.timeThreshold)
);
