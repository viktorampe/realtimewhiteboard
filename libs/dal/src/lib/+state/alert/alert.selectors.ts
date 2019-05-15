import { FilterService, NestedPartial } from '@campus/utils';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Alert, AlertQueueInterface } from '../../+models';
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

export const getAll = createSelector(
  selectAlertState,
  selectAll
);

export const getCount = createSelector(
  selectAlertState,
  selectTotal
);

export const getIds = createSelector(
  selectAlertState,
  selectIds
);

export const getAllEntities = createSelector(
  selectAlertState,
  selectEntities
);

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

/**
 * returns array of Alerts that are unread
 * @example
 * alert$: AlertQueueInterface = this.store.pipe(select(AlertQueries.getUnread));
 */
export const getUnread = createSelector(
  selectAlertState,
  (state: State) =>
    (state.ids as number[])
      .filter(id => !state.entities[id].read)
      .map(id => asAlert(state.entities[id]))
);

/**
 * returns array of Alerts with a validFrom >= a timeThreshold
 * @example
 * alert$: AlertQueueInterface = this.store.pipe(select(AlertQueries.getRecentByDate,
 *    {timeThreshold: someDateValue})
 */
export const getRecentByDate = createSelector(
  selectAlertState,
  (state: State, props: { timeThreshold: number }) =>
    Object.entries(state.entities)
      .filter(
        ([key, value]) =>
          new Date(value.validFrom).getTime() >= props.timeThreshold
      )
      .map(([key, value]) => state.entities[key])
);

export const getAlertIdsByFilter = createSelector(
  selectAlertState,
  (
    state: State,
    props: { filter: NestedPartial<AlertQueueInterface> }
  ): number[] => {
    return new FilterService()
      .filter(Object.values(state.entities), props.filter)
      .map(i => i.id);
  }
);

function asAlert(item: AlertQueueInterface): Alert {
  if (item) {
    return Object.assign<Alert, AlertQueueInterface>(new Alert(), item);
  }
}
