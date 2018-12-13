import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ResultInterface } from '../../+models';
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
 * returns array of assignmentResults grouped by a property
 * @example
 * assignment$: AssignmentResult[] = this.store.pipe(
    select(ResultQueries.getAssignmentsForLearningAreaId,
      { learningAreaId: 1, groupProp: { bundleId: 0 }, groupType: 'bundle' })
    -or-
    select(ResultQueries.getAssignmentsForLearningAreaId,
      { learningAreaId: 1, groupProp: { taskId: 0 }, groupType: 'task' })
  );
 */
export const getAssignmentsForLearningAreaId = createSelector(
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
