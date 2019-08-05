import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  NAME,
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
  State
} from './learning-plan-goal.reducer';

export const selectLearningPlanGoalState = createFeatureSelector<State>(NAME);

export const getError = createSelector(
  selectLearningPlanGoalState,
  (state: State) => state.error
);

export const getAll = createSelector(
  selectLearningPlanGoalState,
  selectAll
);

export const getCount = createSelector(
  selectLearningPlanGoalState,
  selectTotal
);

export const getIds = createSelector(
  selectLearningPlanGoalState,
  selectIds
);

export const getAllEntities = createSelector(
  selectLearningPlanGoalState,
  selectEntities
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * learningPlanGoal$: LearningPlanGoalInterface[] = this.store.pipe(
    select(LearningPlanGoalQueries.getByIds, { ids: [2, 1, 3] })
  );
 */
export const getByIds = createSelector(
  selectLearningPlanGoalState,
  (state: State, props: { ids: number[] }) => {
    return props.ids.map(id => state.entities[id]);
  }
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * learningPlanGoal$: LearningPlanGoalInterface = this.store.pipe(
    select(LearningPlanGoalQueries.getById, { id: 3 })
  );
 */
export const getById = createSelector(
  selectLearningPlanGoalState,
  (state: State, props: { id: number }) => state.entities[props.id]
);

export const isBookLoaded = createSelector(
  selectLearningPlanGoalState,
  (state: State, props: { bookId: number }) =>
    state.loadedBooks.some(loadedBookId => loadedBookId === props.bookId)
);
