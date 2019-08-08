import { groupArrayByKey } from '@campus/utils';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  NAME,
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
  State
} from './learning-plan-goal-progress.reducer';

export const selectLearningPlanGoalProgressState = createFeatureSelector<State>(
  NAME
);

export const getError = createSelector(
  selectLearningPlanGoalProgressState,
  (state: State) => state.error
);

export const getLoaded = createSelector(
  selectLearningPlanGoalProgressState,
  (state: State) => state.loaded
);

export const getAll = createSelector(
  selectLearningPlanGoalProgressState,
  selectAll
);

export const getCount = createSelector(
  selectLearningPlanGoalProgressState,
  selectTotal
);

export const getIds = createSelector(
  selectLearningPlanGoalProgressState,
  selectIds
);

export const getAllEntities = createSelector(
  selectLearningPlanGoalProgressState,
  selectEntities
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * learningPlanGoalProgress$: LearningPlanGoalProgressInterface[] = this.store.pipe(
    select(LearningPlanGoalProgressQueries.getByIds, { ids: [2, 1, 3] })
  );
 */
export const getByIds = createSelector(
  selectLearningPlanGoalProgressState,
  (state: State, props: { ids: number[] }) => {
    return props.ids.map(id => state.entities[id]);
  }
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * learningPlanGoalProgress$: LearningPlanGoalProgressInterface = this.store.pipe(
    select(LearningPlanGoalProgressQueries.getById, { id: 3 })
  );
 */
export const getById = createSelector(
  selectLearningPlanGoalProgressState,
  (state: State, props: { id: number }) => state.entities[props.id]
);

export const getByLearningPlanGoalId = createSelector(
  selectLearningPlanGoalProgressState,
  (state: State) => {
    return groupArrayByKey(Object.values(state.entities), 'learningPlanGoalId');
  }
);
