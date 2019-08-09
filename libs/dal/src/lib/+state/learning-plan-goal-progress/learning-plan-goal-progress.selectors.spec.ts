import { Dictionary } from '@ngrx/entity';
import { LearningPlanGoalProgressQueries } from '.';
import { LearningPlanGoalProgressInterface } from '../../+models';
import { State } from './learning-plan-goal-progress.reducer';

describe('LearningPlanGoalProgress Selectors', () => {
  function createLearningPlanGoalProgress(
    id: number
  ): LearningPlanGoalProgressInterface | any {
    return {
      id: id,
      learningPlanGoalId: (id % 2) + 1
    };
  }

  function createState(
    learningPlanGoalProgresses: LearningPlanGoalProgressInterface[],
    loaded: boolean = false,
    error?: any
  ): State {
    return {
      ids: learningPlanGoalProgresses
        ? learningPlanGoalProgresses.map(
            learningPlanGoalProgress => learningPlanGoalProgress.id
          )
        : [],
      entities: learningPlanGoalProgresses
        ? learningPlanGoalProgresses.reduce(
            (entityMap, learningPlanGoalProgress) => ({
              ...entityMap,
              [learningPlanGoalProgress.id]: learningPlanGoalProgress
            }),
            {} as Dictionary<LearningPlanGoalProgressInterface>
          )
        : {},

      loaded: loaded,
      error: error
    };
  }

  let learningPlanGoalProgressState: State;
  let storeState: any;

  describe('LearningPlanGoalProgress Selectors', () => {
    beforeEach(() => {
      learningPlanGoalProgressState = createState(
        [
          createLearningPlanGoalProgress(4),
          createLearningPlanGoalProgress(1),
          createLearningPlanGoalProgress(2),
          createLearningPlanGoalProgress(3)
        ],
        true,
        'no error'
      );
      storeState = {
        learningPlanGoalProgresses: learningPlanGoalProgressState
      };
    });
    it('getError() should return the error', () => {
      const results = LearningPlanGoalProgressQueries.getError(storeState);
      expect(results).toBe(learningPlanGoalProgressState.error);
    });
    it('getLoaded() should return the loaded boolean', () => {
      const results = LearningPlanGoalProgressQueries.getLoaded(storeState);
      expect(results).toBe(learningPlanGoalProgressState.loaded);
    });
    it('getAll() should return an array of the entities in the order from the ids', () => {
      const results = LearningPlanGoalProgressQueries.getAll(storeState);
      expect(results).toEqual([
        createLearningPlanGoalProgress(4),
        createLearningPlanGoalProgress(1),
        createLearningPlanGoalProgress(2),
        createLearningPlanGoalProgress(3)
      ]);
    });
    it('getCount() should return number of entities', () => {
      const results = LearningPlanGoalProgressQueries.getCount(storeState);
      expect(results).toBe(4);
    });
    it('getIds() should return an array with ids in the correct order', () => {
      const results = LearningPlanGoalProgressQueries.getIds(storeState);
      expect(results).toEqual([4, 1, 2, 3]);
    });
    it('getAllEntities() should return a key value object with all the entities', () => {
      const results = LearningPlanGoalProgressQueries.getAllEntities(
        storeState
      );
      expect(results).toEqual(learningPlanGoalProgressState.entities);
    });
    it('getByIds() should return an array of the requested entities in order and undefined if the id is not present', () => {
      const results = LearningPlanGoalProgressQueries.getByIds(storeState, {
        ids: [3, 1, 90, 2]
      });
      expect(results).toEqual([
        createLearningPlanGoalProgress(3),
        createLearningPlanGoalProgress(1),
        undefined,
        createLearningPlanGoalProgress(2)
      ]);
    });
    it('getById() should return the desired entity', () => {
      const results = LearningPlanGoalProgressQueries.getById(storeState, {
        id: 2
      });
      expect(results).toEqual(createLearningPlanGoalProgress(2));
    });
    it('getById() should return undefined if the entity is not present', () => {
      const results = LearningPlanGoalProgressQueries.getById(storeState, {
        id: 9
      });
      expect(results).toBe(undefined);
    });
    it('getGroupedByLearningPlanGoalId() should return entities grouped by learingPlanGoalId', () => {
      const results = LearningPlanGoalProgressQueries.getGroupedByLearningPlanGoalId(
        storeState
      );
      expect(results).toEqual({
        1: [
          createLearningPlanGoalProgress(2),
          createLearningPlanGoalProgress(4)
        ],
        2: [
          createLearningPlanGoalProgress(1),
          createLearningPlanGoalProgress(3)
        ]
      });
    });
  });
});
