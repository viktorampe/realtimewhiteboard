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

export const getTaskAssigmentsByLearningAreId = createSelector(
  selectResultState,
  (state: State, props: { learningAreaId: number }) => {
    const ids: number[] = <number[]>state.ids;
    const filteredEntities = ids
      .filter(
        id =>
          state.entities[id].taskId &&
          state.entities[id].learningAreaId === props.learningAreaId
      )
      .map(id => state.entities[id]);

    const resultsByTaskId = groupArrayByKey<ResultInterface>(
      Object.values(filteredEntities),
      {
        taskId: 0
      }
    );

    const taskAssigmentResults = Object.keys(resultsByTaskId).map(taskId => ({
      title: resultsByTaskId[taskId][0].assignment,
      type: 'task',
      ...getExerciseResults(resultsByTaskId[taskId])
    }));

    return taskAssigmentResults;
  }
);

export const getBundleAssigmentsByLearningAreId = createSelector(
  selectResultState,
  (state: State, props: { learningAreaId: number }) => {
    const ids: number[] = <number[]>state.ids;
    const filteredEntities = ids
      .filter(
        id =>
          state.entities[id].bundleId &&
          state.entities[id].learningAreaId === props.learningAreaId
      )
      .map(id => state.entities[id]);

    const resultsByBundleId = groupArrayByKey<ResultInterface>(
      Object.values(filteredEntities),
      {
        bundleId: 0
      }
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
  const resultsPerEduContentId = Object.values(
    results.reduce(
      (acc, result) => {
        let group = acc[result.eduContentId];

        if (!group) {
          group = {
            eduContentId: result.eduContentId,
            results: [],
            resultCount: 0,
            resultMaxScore: 0,
            resultMax: undefined,
            resultTotalScore: 0
          };
          acc[result.eduContentId] = group;
        }

        group.results.push(result);
        group.resultCount++;
        if (result.score > group.resultMaxScore) {
          group.resultMaxScore = result.score;
          group.resultMax = result;
        }
        group.resultTotalScore += result.score;

        return acc;
      },
      {} as Dictionary<ExerciseResultsReducerInterface>
    )
  ).map(reducedEducontent => ({
    eduContentId: reducedEducontent.eduContentId,
    results: reducedEducontent.results,
    bestResult: reducedEducontent.resultMax,
    averageScore:
      reducedEducontent.resultTotalScore / reducedEducontent.resultCount
  }));

  const totalScoreAllEduContents = resultsPerEduContentId.reduce(
    (sum, eduC) => (sum += eduC.bestResult.score),
    0
  );
  const averageScoreAllEduContents =
    totalScoreAllEduContents / resultsPerEduContentId.length;

  return {
    totalScore: averageScoreAllEduContents,
    exerciseResults: resultsPerEduContentId
  };
}

interface ExerciseResultsReducerInterface {
  eduContentId: number;
  results: ResultInterface[];
  resultCount: number;
  resultMaxScore: number;
  resultMax: ResultInterface;
  resultTotalScore: number;
}
