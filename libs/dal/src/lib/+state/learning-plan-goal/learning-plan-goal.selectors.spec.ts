import { LearningPlanGoalQueries } from '.';
import { LearningPlanGoalInterface } from '../../+models';
import { State } from './learning-plan-goal.reducer';

describe('LearningPlanGoal Selectors', () => {
  function createLearningPlanGoal(id: number): LearningPlanGoalInterface | any {
    return {
      id: id
    };
  }

  function createState(
    learningPlanGoals: LearningPlanGoalInterface[],
    loaded: boolean = false,
    error?: any
  ): State {
    return {
      ids: learningPlanGoals ? learningPlanGoals.map(learningPlanGoal => learningPlanGoal.id) : [],
      entities: learningPlanGoals
        ? learningPlanGoals.reduce(
            (entityMap, learningPlanGoal) => ({
              ...entityMap,
              [learningPlanGoal.id]: learningPlanGoal
            }),
            {}
          )
        : {},
      loaded: loaded,
      error: error
    };
  }

  let learningPlanGoalState: State;
  let storeState: any;

  describe('LearningPlanGoal Selectors', () => {
    beforeEach(() => {
      learningPlanGoalState = createState(
        [
          createLearningPlanGoal(4),
          createLearningPlanGoal(1),
          createLearningPlanGoal(2),
          createLearningPlanGoal(3)
        ],
        true,
        'no error'
      );
      storeState = { learningPlanGoals: learningPlanGoalState };
    });
    it('getError() should return the error', () => {
      const results = LearningPlanGoalQueries.getError(storeState);
      expect(results).toBe(learningPlanGoalState.error);
    });
    it('getLoaded() should return the loaded boolean', () => {
      const results = LearningPlanGoalQueries.getLoaded(storeState);
      expect(results).toBe(learningPlanGoalState.loaded);
    });
    it('getAll() should return an array of the entities in the order from the ids', () => {
      const results = LearningPlanGoalQueries.getAll(storeState);
      expect(results).toEqual([
        createLearningPlanGoal(4),
        createLearningPlanGoal(1),
        createLearningPlanGoal(2),
        createLearningPlanGoal(3)
      ]);
    });
    it('getCount() should return number of entities', () => {
      const results = LearningPlanGoalQueries.getCount(storeState);
      expect(results).toBe(4);
    });
    it('getIds() should return an array with ids in the correct order', () => {
      const results = LearningPlanGoalQueries.getIds(storeState);
      expect(results).toEqual([4, 1, 2, 3]);
    });
    it('getAllEntities() should return a key value object with all the entities', () => {
      const results = LearningPlanGoalQueries.getAllEntities(storeState);
      expect(results).toEqual(learningPlanGoalState.entities);
    });
    it('getByIds() should return an array of the requested entities in order and undefined if the id is not present', () => {
      const results = LearningPlanGoalQueries.getByIds(storeState, {
        ids: [3, 1, 90, 2]
      });
      expect(results).toEqual([
        createLearningPlanGoal(3),
        createLearningPlanGoal(1),
        undefined,
        createLearningPlanGoal(2)
      ]);
    });
    it('getById() should return the desired entity', () => {
      const results = LearningPlanGoalQueries.getById(storeState, { id: 2 });
      expect(results).toEqual(createLearningPlanGoal(2));
    });
    it('getById() should return undefined if the entity is not present', () => {
      const results = LearningPlanGoalQueries.getById(storeState, { id: 9 });
      expect(results).toBe(undefined);
    });
  });
});
