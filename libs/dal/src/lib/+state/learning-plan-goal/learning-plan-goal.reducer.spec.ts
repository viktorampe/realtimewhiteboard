import { LearningPlanGoalActions } from '.';
import { LearningPlanGoalInterface } from '../../+models';
import { initialState, reducer, State } from './learning-plan-goal.reducer';

const goalInitialValue = 'De leerlingen kunnen tellen tot 10.';
const goalUpdatedValue =
  'De leerlingen kunnen differentiaalvergelijkingen oplossen.';

/**
 * Creates a LearningPlanGoal.
 * @param {number} id
 * @returns {LearningPlanGoalInterface}
 */
function createLearningPlanGoal(
  id: number,
  goal: any = goalInitialValue
): LearningPlanGoalInterface | any {
  return {
    id: id,
    goal: goal
  };
}

/**
 * Utility to create the learning-plan-goal state.
 *
 * @param {LearningPlanGoalInterface[]} learningPlanGoals
 * @param {boolean} [loaded]
 * @param {*} [error]
 * @returns {State}
 */
function createState(
  learningPlanGoals: LearningPlanGoalInterface[],
  loadedBooks: number[],
  error?: any
): State {
  const state: any = {
    ids: learningPlanGoals
      ? learningPlanGoals.map(learningPlanGoal => learningPlanGoal.id)
      : [],
    entities: learningPlanGoals
      ? learningPlanGoals.reduce(
          (entityMap, learningPlanGoal) => ({
            ...entityMap,
            [learningPlanGoal.id]: learningPlanGoal
          }),
          {}
        )
      : {},
    loadedBooks
  };
  if (error !== undefined) state.error = error;
  return state;
}

describe('LearningPlanGoals Reducer', () => {
  const bookId = 1;
  let learningPlanGoals: LearningPlanGoalInterface[];

  beforeEach(() => {
    learningPlanGoals = [
      createLearningPlanGoal(1),
      createLearningPlanGoal(2),
      createLearningPlanGoal(3)
    ];
  });

  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });

  describe('loaded action', () => {
    it('should error', () => {
      const error = 'Something went wrong';
      const action = new LearningPlanGoalActions.LearningPlanGoalsLoadError(
        error
      );
      const result = reducer(initialState, action);
      expect(result).toEqual(createState([], [], error));
    });
  });

  describe('add actions', () => {
    it('should add multiple learningPlanGoals for a book', () => {
      const action = new LearningPlanGoalActions.AddLearningPlanGoalsForBook({
        bookId,
        learningPlanGoals
      });
      const result = reducer(initialState, action);

      expect(result).toEqual(createState(learningPlanGoals, []));
    });
  });

  describe('clear action', () => {
    it('should clear the learningPlanGoals collection', () => {
      const startState = createState(
        learningPlanGoals,
        [],
        'something went wrong'
      );
      const action = new LearningPlanGoalActions.ClearLearningPlanGoals();
      const result = reducer(startState, action);
      expect(result).toEqual(createState([], [], 'something went wrong'));
    });

    it('should clear the loadedBooks collection', () => {
      const startState = createState(
        learningPlanGoals,
        [bookId],
        'something went wrong'
      );
      const action = new LearningPlanGoalActions.ClearLoadedBooks();
      const result = reducer(startState, action);
      expect(result).toEqual(
        createState(learningPlanGoals, [], 'something went wrong')
      );
    });
  });
});
