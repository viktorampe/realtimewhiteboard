import { groupArrayByKey } from '@campus/utils';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Result, ResultInterface } from '../../+models';
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

/**
 * returns dictionary of results grouped by a property
 * @example
 * results$: ResultInterface[] = this.store.pipe(
    select(ResultQueries.getResultsForLearningAreaIdGrouped,
      { learningAreaId: 1, groupProp: { bundleId: 0 } })
    -or-
    select(ResultQueries.getResultsForLearningAreaIdGrouped,
      { learningAreaId: 1, groupProp: { taskId: 0 } })
  );
 */
export const getResultsForLearningAreaIdGrouped = createSelector(
  selectResultState,
  (
    state: State,
    props: {
      learningAreaId: number;
      groupProp: Partial<ResultInterface>;
    }
  ) => {
    const ids: number[] = <number[]>state.ids;
    const groupKey = Object.keys(props.groupProp)[0];

    return ids.reduce((acc, id) => {
      // mapping
      const result = state.entities[id];
      // filtering
      if (result[groupKey] && result.learningAreaId === props.learningAreaId) {
        // grouping
        if (!acc[result[groupKey]]) {
          acc[result[groupKey]] = [];
        }
        acc[result[groupKey]].push(result);
      }
      return acc;
    }, {});
  }
);
export const getLearningAreaIds = createSelector(
  selectResultState,
  (state: State) => {
    return Array.from(
      new Set(
        Object.values(state.entities).map(result => result.learningAreaId)
      )
    );
  }
);

export const getResultsGroupedByArea = createSelector(
  selectResultState,
  (state: State) => {
    const ids: number[] = <number[]>state.ids;
    return groupArrayByKey(Object.values(state.entities), 'learningAreaId');
  }
);

export const getBestResultByEduContentId = createSelector(
  selectResultState,
  (state: State) => {
    const ids: number[] = <number[]>state.ids;

    return ids.reduce((acc, id): {
      [eduContentId: number]: ResultInterface;
    } => {
      const result = state.entities[id];
      const eduContentId = result.eduContentId;

      // treat 0 as a better value than undefined
      const asInteger = (score?: number) =>
        Number.isInteger(score) ? score : -1;

      if (
        !acc[eduContentId] ||
        asInteger(acc[eduContentId].score) < asInteger(result.score)
      ) {
        acc[eduContentId] = Object.assign(new Result(), result) as Result;
      }

      return acc;
    }, {});
  }
);
