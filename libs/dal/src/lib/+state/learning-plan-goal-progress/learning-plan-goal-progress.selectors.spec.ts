import { Dictionary } from '@ngrx/entity';
import { LearningPlanGoalProgressQueries } from '.';
import { LearningPlanGoalProgressFixture } from '../../+fixtures';
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

  describe('find', () => {
    const learningPlanGoalProgressArray = [
      new LearningPlanGoalProgressFixture({
        id: 1,
        classGroupId: 1,
        personId: 1,
        learningPlanGoalId: 1,
        eduContentTOCId: 1,
        userLessonId: undefined
      }),
      new LearningPlanGoalProgressFixture({
        id: 2,
        classGroupId: 2,
        personId: 1,
        learningPlanGoalId: 1,
        eduContentTOCId: 1,
        userLessonId: undefined
      }),
      new LearningPlanGoalProgressFixture({
        id: 3,
        classGroupId: 1,
        personId: 2,
        learningPlanGoalId: 1,
        eduContentTOCId: 1,
        userLessonId: undefined
      }),
      new LearningPlanGoalProgressFixture({
        id: 4,
        classGroupId: 1,
        personId: 1,
        learningPlanGoalId: 2,
        eduContentTOCId: 1,
        userLessonId: undefined
      }),
      new LearningPlanGoalProgressFixture({
        id: 5,
        classGroupId: 1,
        personId: 1,
        learningPlanGoalId: 1,
        eduContentTOCId: 2,
        userLessonId: undefined
      }),
      new LearningPlanGoalProgressFixture({
        id: 6,
        classGroupId: 1,
        personId: 1,
        learningPlanGoalId: 1,
        eduContentTOCId: undefined,
        userLessonId: 1
      }),
      new LearningPlanGoalProgressFixture({
        id: 7,
        classGroupId: 2,
        personId: 1,
        learningPlanGoalId: 1,
        eduContentTOCId: undefined,
        userLessonId: 1
      }),
      new LearningPlanGoalProgressFixture({
        id: 8,
        classGroupId: 1,
        personId: 2,
        learningPlanGoalId: 1,
        eduContentTOCId: undefined,
        userLessonId: 1
      }),
      new LearningPlanGoalProgressFixture({
        id: 9,
        classGroupId: 1,
        personId: 1,
        learningPlanGoalId: 2,
        eduContentTOCId: undefined,
        userLessonId: 1
      }),
      new LearningPlanGoalProgressFixture({
        id: 10,
        classGroupId: 1,
        personId: 1,
        learningPlanGoalId: 1,
        eduContentTOCId: undefined,
        userLessonId: 2
      })
    ];

    beforeEach(() => {
      learningPlanGoalProgressState = createState(
        learningPlanGoalProgressArray,
        true,
        'no error'
      );
      storeState = {
        learningPlanGoalProgresses: learningPlanGoalProgressState
      };
    });

    describe('findMany', () => {
      it('should return all LearningPlanGoalProgress', () => {
        const results = LearningPlanGoalProgressQueries.findMany(
          storeState,
          {}
        );
        expect(results.length).toBe(10);
        expect(results).toEqual(learningPlanGoalProgressArray);
      });

      it('should return the correct LearningPlanGoalProgress for ClassGroupId', () => {
        const results = LearningPlanGoalProgressQueries.findMany(storeState, {
          classGroupId: 2
        });
        expect(results.length).toBe(2);
        expect(results).toEqual([
          learningPlanGoalProgressArray[1],
          learningPlanGoalProgressArray[6]
        ]);
      });

      it('should return the correct LearningPlanGoalProgress for eduContentTOCId', () => {
        const results = LearningPlanGoalProgressQueries.findMany(storeState, {
          classGroupId: 1,
          learningPlanGoalId: 1,
          eduContentTOCId: 1
        });
        expect(results.length).toBe(2);
        expect(results).toEqual([
          learningPlanGoalProgressArray[0],
          learningPlanGoalProgressArray[2]
        ]);
      });

      it('should return the correct LearningPlanGoalProgress for userLessonId', () => {
        const results = LearningPlanGoalProgressQueries.findMany(storeState, {
          classGroupId: 1,
          learningPlanGoalId: 1,
          userLessonId: 1
        });
        expect(results.length).toBe(2);
        expect(results).toEqual([
          learningPlanGoalProgressArray[5],
          learningPlanGoalProgressArray[7]
        ]);
      });
    });

    describe('findOne', () => {
      it('should return the correct LearningPlanGoalProgress for ClassGroupId', () => {
        const result = LearningPlanGoalProgressQueries.findOne(storeState, {
          classGroupId: 2
        });

        expect(result).toEqual(learningPlanGoalProgressArray[1]);
      });

      it('should return the correct LearningPlanGoalProgress for eduContentTOCId', () => {
        const result = LearningPlanGoalProgressQueries.findOne(storeState, {
          classGroupId: 1,
          learningPlanGoalId: 1,
          eduContentTOCId: 1
        });

        expect(result).toEqual(learningPlanGoalProgressArray[0]);
      });

      it('should return the correct LearningPlanGoalProgress for userLessonId', () => {
        const result = LearningPlanGoalProgressQueries.findOne(storeState, {
          classGroupId: 1,
          learningPlanGoalId: 1,
          userLessonId: 1
        });

        expect(result).toEqual(learningPlanGoalProgressArray[5]);
      });
    });
  });
});
