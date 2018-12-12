import { groupArrayByKey } from '@campus/utils';
import { Dictionary } from '@ngrx/entity';
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

export const getTaskAssignmentsForLearningAreaId = createSelector(
  selectResultState,
  (state: State, props: { learningAreaId: number }) => {
    const ids: number[] = <number[]>state.ids;

    const resultsByTaskId: Dictionary<ResultInterface[]> = ids.reduce(
      (acc, id) => {
        // mapping
        const result = state.entities[id];
        // filtering
        if (result.taskId && result.learningAreaId === props.learningAreaId) {
          // grouping
          if (!acc[result.taskId]) {
            acc[result.taskId] = [];
          }
          acc[result.taskId].push(result);
        }
        return acc;
      },
      {}
    );

    const taskAssigmentResults = Object.keys(resultsByTaskId).map(taskId => ({
      title: resultsByTaskId[taskId][0].assignment,
      type: 'task',
      ...getExerciseResults(resultsByTaskId[taskId])
    }));

    return taskAssigmentResults;
  }
);

export const getBundleAssignmentsForLearningAreaId = createSelector(
  selectResultState,
  (state: State, props: { learningAreaId: number }) => {
    const ids: number[] = <number[]>state.ids;

    const resultsByBundleId: Dictionary<ResultInterface[]> = ids.reduce(
      (acc, id) => {
        // mapping
        const result = state.entities[id];
        // filtering
        if (result.bundleId && result.learningAreaId === props.learningAreaId) {
          // grouping
          if (!acc[result.bundleId]) {
            acc[result.bundleId] = [];
          }
          acc[result.bundleId].push(result);
        }
        return acc;
      },
      {}
    );

    const bundleAssigmentResults = Object.keys(resultsByBundleId).map(
      bundleId => ({
        title: resultsByBundleId[bundleId][0].assignment,
        type: 'bundle',
        ...getExerciseResults(resultsByBundleId[bundleId])
      })
    );

    return bundleAssigmentResults;
  }
);

export function getExerciseResults(results: ResultInterface[]): {} {
  const resultsByEduContentId = groupArrayByKey<ResultInterface>(results, {
    eduContentId: 0
  });

  const exerciseResults = Object.keys(resultsByEduContentId).map(
    eduContentId => {
      const eduContentResults = resultsByEduContentId[eduContentId];

      let bestResult = eduContentResults[0],
        totalScore = 0;

      eduContentResults.forEach(result => {
        if (result.score > bestResult.score) {
          bestResult = result;
        }
        totalScore += result.score;
      });

      return {
        eduContentId: +eduContentId,
        results: eduContentResults,
        bestResult: bestResult,
        averageScore: totalScore / eduContentResults.length
      } as ExerciseResultsInterface;
    }
  );

  const totalScoreAllEduContents = exerciseResults.reduce(
    (sum, value) => (sum += value.bestResult.score),
    0
  );

  const averageScoreAllEduContents =
    totalScoreAllEduContents / exerciseResults.length;

  return {
    totalScore: averageScoreAllEduContents,
    exerciseResults: exerciseResults
  };
}

interface ExerciseResultsInterface {
  eduContentId: number;
  results: ResultInterface[];
  bestResult: ResultInterface;
  averageScore: number;
}
