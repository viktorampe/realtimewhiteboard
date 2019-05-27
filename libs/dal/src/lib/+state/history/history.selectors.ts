import { createFeatureSelector, createSelector } from '@ngrx/store';
import { HistoryInterface } from '../../+models';
import {
  NAME,
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
  State
} from './history.reducer';

export const selectHistoryState = createFeatureSelector<State>(NAME);

export const getError = createSelector(
  selectHistoryState,
  (state: State) => state.error
);

export const getLoaded = createSelector(
  selectHistoryState,
  (state: State) => state.loaded
);

export const getAll = createSelector(
  selectHistoryState,
  selectAll
);

export const getCount = createSelector(
  selectHistoryState,
  selectTotal
);

export const getIds = createSelector(
  selectHistoryState,
  selectIds
);

export const getAllEntities = createSelector(
  selectHistoryState,
  selectEntities
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * history$: HistoryInterface[] = this.store.pipe(
    select(HistoryQueries.getByIds, { ids: [2, 1, 3] })
  );
 */
export const getByIds = createSelector(
  selectHistoryState,
  (state: State, props: { ids: number[] }) => {
    return props.ids.map(id => state.entities[id]);
  }
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * history$: HistoryInterface = this.store.pipe(
    select(HistoryQueries.getById, { id: 3 })
  );
 */
export const getById = createSelector(
  selectHistoryState,
  (state: State, props: { id: number }) => state.entities[props.id]
);

/**
 * returns an object with history grouped by type, ordered by date descending
 * @example
 * history$: HistoryInterface = this.store.pipe(
  select(HistoryQueries.historyByType)
);
*/
export const historyByType = createSelector(
  selectHistoryState,
  (state: State) => {
    // must cast state.ids to number[] (from 'string[] | number[]') or we can't use array functions like forEach
    const ids = [...(state.ids as number[])];
    const sortedIds = ids.sort((a, b) =>
      new Date(state.entities[a].created) < new Date(state.entities[b].created)
        ? 1
        : -1
    );

    const byKey: { [key: string]: HistoryInterface[] } = {};
    sortedIds.forEach((id: number) => {
      const item = state.entities[id];
      if (!byKey[item.type]) {
        byKey[item.type] = [];
      }
      if (byKey[item.type].length < 10) {
        byKey[item.type].push(item);
      }
    });

    return byKey;
  }
);
