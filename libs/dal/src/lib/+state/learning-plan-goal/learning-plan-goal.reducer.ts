import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { LearningPlanGoalInterface } from '../../+models';
import {
  LearningPlanGoalsActions,
  LearningPlanGoalsActionTypes
} from './learning-plan-goal.actions';

export const NAME = 'learningPlanGoals';

export interface State extends EntityState<LearningPlanGoalInterface> {
  // additional entities state properties
  error?: any;
  loadedBooks: number[];
}

export const adapter: EntityAdapter<
  LearningPlanGoalInterface
> = createEntityAdapter<LearningPlanGoalInterface>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  loadedBooks: []
});

export function reducer(
  state = initialState,
  action: LearningPlanGoalsActions
): State {
  switch (action.type) {
    case LearningPlanGoalsActionTypes.AddLearningPlanGoalsForBook: {
      return adapter.addMany(action.payload.learningPlanGoals, state);
    }

    case LearningPlanGoalsActionTypes.AddLoadedBook: {
      return {
        ...state,
        loadedBooks: [...state.loadedBooks, action.payload.bookId]
      };
    }

    case LearningPlanGoalsActionTypes.LearningPlanGoalsLoadError: {
      return { ...state, error: action.payload, loadedBooks: [] };
    }

    case LearningPlanGoalsActionTypes.ClearLearningPlanGoals: {
      return adapter.removeAll(state);
    }

    case LearningPlanGoalsActionTypes.ClearLoadedBooks: {
      return { ...state, loadedBooks: [] };
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
