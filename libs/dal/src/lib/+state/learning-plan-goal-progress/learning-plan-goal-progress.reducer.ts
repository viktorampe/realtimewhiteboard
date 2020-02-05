import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { LearningPlanGoalProgressInterface } from '../../+models';
import {
  LearningPlanGoalProgressesActions,
  LearningPlanGoalProgressesActionTypes
} from './learning-plan-goal-progress.actions';

export const NAME = 'learningPlanGoalProgresses';

export interface State extends EntityState<LearningPlanGoalProgressInterface> {
  // additional entities state properties
  loaded: boolean;
  error?: any;
}

export const adapter: EntityAdapter<LearningPlanGoalProgressInterface> = createEntityAdapter<
  LearningPlanGoalProgressInterface
>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  loaded: false
});

export function reducer(
  state = initialState,
  action: LearningPlanGoalProgressesActions
): State {
  switch (action.type) {
    case LearningPlanGoalProgressesActionTypes.AddLearningPlanGoalProgress: {
      return adapter.addOne(action.payload.learningPlanGoalProgress, state);
    }

    case LearningPlanGoalProgressesActionTypes.UpsertLearningPlanGoalProgress: {
      return adapter.upsertOne(action.payload.learningPlanGoalProgress, state);
    }

    case LearningPlanGoalProgressesActionTypes.AddLearningPlanGoalProgresses: {
      return adapter.addMany(action.payload.learningPlanGoalProgresses, state);
    }

    case LearningPlanGoalProgressesActionTypes.UpsertLearningPlanGoalProgresses: {
      return adapter.upsertMany(
        action.payload.learningPlanGoalProgresses,
        state
      );
    }

    case LearningPlanGoalProgressesActionTypes.UpdateLearningPlanGoalProgress: {
      return adapter.updateOne(action.payload.learningPlanGoalProgress, state);
    }

    case LearningPlanGoalProgressesActionTypes.UpdateLearningPlanGoalProgresses: {
      return adapter.updateMany(
        action.payload.learningPlanGoalProgresses,
        state
      );
    }

    case LearningPlanGoalProgressesActionTypes.DeleteLearningPlanGoalProgress: {
      return adapter.removeOne(action.payload.id, state);
    }

    case LearningPlanGoalProgressesActionTypes.DeleteLearningPlanGoalProgresses: {
      return adapter.removeMany(action.payload.ids, state);
    }

    case LearningPlanGoalProgressesActionTypes.LearningPlanGoalProgressesLoaded: {
      return adapter.addAll(action.payload.learningPlanGoalProgresses, {
        ...state,
        loaded: true
      });
    }

    case LearningPlanGoalProgressesActionTypes.LearningPlanGoalProgressesLoadError: {
      return { ...state, error: action.payload, loaded: false };
    }

    case LearningPlanGoalProgressesActionTypes.ClearLearningPlanGoalProgresses: {
      return adapter.removeAll(state);
    }

    default: {
      return state;
    }
  }
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = adapter.getSelectors();
