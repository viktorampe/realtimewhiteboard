import { ResultInterface } from '@campus/dal';
import { groupArrayByKey } from '@campus/utils';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  NAME,
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
  State
} from './result.reducer';

export const selectResultState = createFeatureSelector<State>(NAME);

export const getError = createSelector(
  selectResultState,
  (state: State) => state.error
);

export const getLoaded = createSelector(
  selectResultState,
  (state: State) => state.loaded
);

export const getAll = createSelector(
  selectResultState,
  selectAll
);

export const getCount = createSelector(
  selectResultState,
  selectTotal
);

export const getIds = createSelector(
  selectResultState,
  selectIds
);

export const getAllEntities = createSelector(
  selectResultState,
  selectEntities
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * result$: ResultInterface[] = this.store.pipe(
    select(ResultQueries.getByIds, { ids: [2, 1, 3] })
  );
 */
export const getByIds = createSelector(
  selectResultState,
  (state: State, props: { ids: number[] }) => {
    return props.ids.map(id => state.entities[id]);
  }
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * result$: ResultInterface = this.store.pipe(
    select(ResultQueries.getById, { id: 3 })
  );
 */
export const getById = createSelector(
  selectResultState,
  (state: State, props: { id: number }) => state.entities[props.id]
);

export const getByTaskIdGroupedByEduContentId = createSelector(
  selectResultState,
  (state: State, props: { taskId: number }) => {
    const ids: number[] = <number[]>state.ids;
    const filteredEntities = ids
      .filter(id => state.entities[id].taskId === props.taskId)
      .map(id => state.entities[id]);

    return groupArrayByKey<ResultInterface>(Object.values(filteredEntities), {
      eduContentId: 0
    });
  }
);
