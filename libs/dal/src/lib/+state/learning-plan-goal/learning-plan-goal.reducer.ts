import {
  createEntityAdapter,
  Dictionary,
  EntityAdapter,
  EntityState
} from '@ngrx/entity';
import { LearningPlanGoalInterface } from '../../+models';
import {
  LearningPlanGoalsActions,
  LearningPlanGoalsActionTypes
} from './learning-plan-goal.actions';

export const NAME = 'learningPlanGoals';

export interface State extends EntityState<LearningPlanGoalInterface> {
  // additional entities state properties
  error?: any;
  loadedBooks: Dictionary<number[]>;
}

export const adapter: EntityAdapter<
  LearningPlanGoalInterface
> = createEntityAdapter<LearningPlanGoalInterface>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  loadedBooks: {}
});

export function reducer(
  state = initialState,
  action: LearningPlanGoalsActions
): State {
  switch (action.type) {
    case LearningPlanGoalsActionTypes.AddLearningPlanGoalsForBook: {
      const loadedBookState = {
        ...state,
        loadedBooks: {
          ...state.loadedBooks,
          [action.payload.bookId]: action.payload.learningPlanGoals.map(
            learningPlanGoal => learningPlanGoal.id
          )
        }
      };

      return adapter.addMany(action.payload.learningPlanGoals, loadedBookState);
    }

    case LearningPlanGoalsActionTypes.LearningPlanGoalsLoadError: {
      return { ...state, error: action.payload, loadedBooks: {} };
    }

    case LearningPlanGoalsActionTypes.ClearLearningPlanGoals: {
      const stateWithEmptyLoadedBooks = { ...state, loadedBooks: {} };

      return adapter.removeAll(stateWithEmptyLoadedBooks);
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
