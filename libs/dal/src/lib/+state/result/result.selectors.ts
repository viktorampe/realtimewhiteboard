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

export const getAll = createSelector(selectResultState, selectAll);

export const getCount = createSelector(selectResultState, selectTotal);

export const getIds = createSelector(selectResultState, selectIds);

export const getAllEntities = createSelector(selectResultState, selectEntities);

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

export const getResultsForTasks = createSelector(
  selectResultState,
  (state: State) => {
    const resultIds = Array.from(
      new Set(
        Object.values(state.entities)
          .filter(result => result.taskId)
          .map(result => result.id)
      )
    );
    return resultIds.map(resultId => state.entities[resultId]);
  }
);

export const getResultsForBundles = createSelector(
  selectResultState,
  (state: State) => {
    const resultIds = Array.from(
      new Set(
        Object.values(state.entities)
          .filter(result => !result.taskId)
          .map(result => result.id)
      )
    );

    return resultIds.map(resultId => state.entities[resultId]);
  }
);

export const getResultsGroupedByArea = createSelector(
  selectResultState,
  (state: State) => {
    const ids: number[] = <number[]>state.ids;
    const map: ResultsGroupedByArea = ids.reduce(
      (acc, id) => {
        const resultLearningAreaId = state.entities[id].learningAreaId;
        const result = state.entities[id];
        // group by learning area
        if (!acc[resultLearningAreaId]) {
          acc[resultLearningAreaId] = {
            tasks: new Set<number>(),
            bundles: new Set<number>()
          };
        }

        if (result.taskId) acc[resultLearningAreaId].tasks.add(result.taskId);
        if (result.unlockedContentId)
          acc[resultLearningAreaId].bundles.add(result.unlockedContentId);

        return acc;
      },
      {} as ResultsGroupedByArea
    );

    return map;
  }
);

interface ResultsGroupedByArea {
  [key: number]: {
    tasks: Set<number>;
    bundles: Set<number>;
  };
}
