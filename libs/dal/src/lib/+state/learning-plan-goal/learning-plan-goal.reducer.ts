import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { LearningPlanGoalInterface } from '../../+models';
import {
  LearningPlanGoalsActions,
  LearningPlanGoalsActionTypes
} from './learning-plan-goal.actions';

export const NAME = 'learningPlanGoals';

export interface State extends EntityState<LearningPlanGoalInterface> {
  // additional entities state properties
  loaded: boolean;
  error?: any;
}

export const adapter: EntityAdapter<LearningPlanGoalInterface> = createEntityAdapter<
  LearningPlanGoalInterface
>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  loaded: false
});

export function reducer(
  state = initialState,
  action: LearningPlanGoalsActions
): State {
  switch (action.type) {
    case LearningPlanGoalsActionTypes.AddLearningPlanGoal: {
      return adapter.addOne(action.payload.learningPlanGoal, state);
    }

    case LearningPlanGoalsActionTypes.UpsertLearningPlanGoal: {
      return adapter.upsertOne(action.payload.learningPlanGoal, state);
    }

    case LearningPlanGoalsActionTypes.AddLearningPlanGoals: {
      return adapter.addMany(action.payload.learningPlanGoals, state);
    }

    case LearningPlanGoalsActionTypes.UpsertLearningPlanGoals: {
      return adapter.upsertMany(action.payload.learningPlanGoals, state);
    }

    case LearningPlanGoalsActionTypes.UpdateLearningPlanGoal: {
      return adapter.updateOne(action.payload.learningPlanGoal, state);
    }

    case LearningPlanGoalsActionTypes.UpdateLearningPlanGoals: {
      return adapter.updateMany(action.payload.learningPlanGoals, state);
    }

    case LearningPlanGoalsActionTypes.DeleteLearningPlanGoal: {
      return adapter.removeOne(action.payload.id, state);
    }

    case LearningPlanGoalsActionTypes.DeleteLearningPlanGoals: {
      return adapter.removeMany(action.payload.ids, state);
    }

    case LearningPlanGoalsActionTypes.LearningPlanGoalsLoaded: {
      return adapter.addAll(action.payload.learningPlanGoals, { ...state, loaded: true });
    }

    case LearningPlanGoalsActionTypes.LearningPlanGoalsLoadError: {
      return { ...state, error: action.payload, loaded: false };
    }

    case LearningPlanGoalsActionTypes.ClearLearningPlanGoals: {
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
