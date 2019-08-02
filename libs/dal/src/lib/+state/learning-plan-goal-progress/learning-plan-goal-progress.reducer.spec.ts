import { Update } from '@ngrx/entity';
import { LearningPlanGoalProgressActions } from '.';
import { LearningPlanGoalProgressInterface } from '../../+models';
import {
  initialState,
  reducer,
  State
} from './learning-plan-goal-progress.reducer';

/**
 * This file is scaffolded, but needs some special attention:
 * - find and replace 'schoolYear' and replace this with a property name of the LearningPlanGoalProgress entity.
 * - set the initial property value via '[schoolYear]InitialValue'.
 * - set the updated property value via '[schoolYear]UpdatedValue'.
 */
const schoolYearInitialValue = 2018;
const schoolYearUpdatedValue = 2019;

/**
 * Creates a LearningPlanGoalProgress.
 * @param {number} id
 * @returns {LearningPlanGoalProgressInterface}
 */
function createLearningPlanGoalProgress(
  id: number,
  schoolYear: any = schoolYearInitialValue
): LearningPlanGoalProgressInterface | any {
  return {
    id: id,
    schoolYear: schoolYear
  };
}

/**
 * Utility to create the learning-plan-goal-progress state.
 *
 * @param {LearningPlanGoalProgressInterface[]} learningPlanGoalProgresses
 * @param {boolean} [loaded]
 * @param {*} [error]
 * @returns {State}
 */
function createState(
  learningPlanGoalProgresses: LearningPlanGoalProgressInterface[],
  loaded: boolean = false,
  error?: any
): State {
  const state: any = {
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
          {}
        )
      : {},
    loaded: loaded
  };
  if (error !== undefined) state.error = error;
  return state;
}

describe('LearningPlanGoalProgresses Reducer', () => {
  let learningPlanGoalProgresses: LearningPlanGoalProgressInterface[];
  beforeEach(() => {
    learningPlanGoalProgresses = [
      createLearningPlanGoalProgress(1),
      createLearningPlanGoalProgress(2),
      createLearningPlanGoalProgress(3)
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
    it('should load all learningPlanGoalProgresses', () => {
      const action = new LearningPlanGoalProgressActions.LearningPlanGoalProgressesLoaded(
        { learningPlanGoalProgresses }
      );
      const result = reducer(initialState, action);
      expect(result).toEqual(createState(learningPlanGoalProgresses, true));
    });

    it('should error', () => {
      const error = 'Something went wrong';
      const action = new LearningPlanGoalProgressActions.LearningPlanGoalProgressesLoadError(
        error
      );
      const result = reducer(initialState, action);
      expect(result).toEqual(createState([], false, error));
    });
  });

  describe('add actions', () => {
    it('should add one learningPlanGoalProgress', () => {
      const learningPlanGoalProgress = learningPlanGoalProgresses[0];
      const action = new LearningPlanGoalProgressActions.AddLearningPlanGoalProgress(
        {
          learningPlanGoalProgress
        }
      );

      const result = reducer(initialState, action);
      expect(result).toEqual(createState([learningPlanGoalProgress], false));
    });

    it('should add multiple learningPlanGoalProgresses', () => {
      const action = new LearningPlanGoalProgressActions.AddLearningPlanGoalProgresses(
        { learningPlanGoalProgresses }
      );
      const result = reducer(initialState, action);

      expect(result).toEqual(createState(learningPlanGoalProgresses, false));
    });
  });
  describe('upsert actions', () => {
    it('should upsert one learningPlanGoalProgress', () => {
      const originalLearningPlanGoalProgress = learningPlanGoalProgresses[0];

      const startState = reducer(
        initialState,
        new LearningPlanGoalProgressActions.AddLearningPlanGoalProgress({
          learningPlanGoalProgress: originalLearningPlanGoalProgress
        })
      );

      const updatedLearningPlanGoalProgress = createLearningPlanGoalProgress(
        learningPlanGoalProgresses[0].id,
        'test'
      );

      const action = new LearningPlanGoalProgressActions.UpsertLearningPlanGoalProgress(
        {
          learningPlanGoalProgress: updatedLearningPlanGoalProgress
        }
      );

      const result = reducer(startState, action);

      expect(result.entities[updatedLearningPlanGoalProgress.id]).toEqual(
        updatedLearningPlanGoalProgress
      );
    });

    it('should upsert many learningPlanGoalProgresses', () => {
      const startState = createState(learningPlanGoalProgresses);

      const learningPlanGoalProgressesToInsert = [
        createLearningPlanGoalProgress(1),
        createLearningPlanGoalProgress(2),
        createLearningPlanGoalProgress(3),
        createLearningPlanGoalProgress(4)
      ];
      const action = new LearningPlanGoalProgressActions.UpsertLearningPlanGoalProgresses(
        {
          learningPlanGoalProgresses: learningPlanGoalProgressesToInsert
        }
      );

      const result = reducer(startState, action);

      expect(result).toEqual(createState(learningPlanGoalProgressesToInsert));
    });
  });

  describe('update actions', () => {
    it('should update an learningPlanGoalProgress', () => {
      const learningPlanGoalProgress = learningPlanGoalProgresses[0];
      const startState = createState([learningPlanGoalProgress]);
      const update: Update<LearningPlanGoalProgressInterface> = {
        id: 1,
        changes: {
          schoolYear: schoolYearUpdatedValue
        }
      };
      const action = new LearningPlanGoalProgressActions.UpdateLearningPlanGoalProgress(
        {
          learningPlanGoalProgress: update
        }
      );
      const result = reducer(startState, action);
      expect(result).toEqual(
        createState([createLearningPlanGoalProgress(1, schoolYearUpdatedValue)])
      );
    });

    it('should update multiple learningPlanGoalProgresses', () => {
      const startState = createState(learningPlanGoalProgresses);
      const updates: Update<LearningPlanGoalProgressInterface>[] = [
        {
          id: 1,
          changes: {
            schoolYear: schoolYearUpdatedValue
          }
        },
        {
          id: 2,
          changes: {
            schoolYear: schoolYearUpdatedValue
          }
        }
      ];
      const action = new LearningPlanGoalProgressActions.UpdateLearningPlanGoalProgresses(
        {
          learningPlanGoalProgresses: updates
        }
      );
      const result = reducer(startState, action);

      expect(result).toEqual(
        createState([
          createLearningPlanGoalProgress(1, schoolYearUpdatedValue),
          createLearningPlanGoalProgress(2, schoolYearUpdatedValue),
          learningPlanGoalProgresses[2]
        ])
      );
    });
  });

  describe('delete actions', () => {
    it('should delete one learningPlanGoalProgress ', () => {
      const learningPlanGoalProgress = learningPlanGoalProgresses[0];
      const startState = createState([learningPlanGoalProgress]);
      const action = new LearningPlanGoalProgressActions.DeleteLearningPlanGoalProgress(
        {
          id: learningPlanGoalProgress.id
        }
      );
      const result = reducer(startState, action);
      expect(result).toEqual(createState([]));
    });

    it('should delete multiple learningPlanGoalProgresses', () => {
      const startState = createState(learningPlanGoalProgresses);
      const action = new LearningPlanGoalProgressActions.DeleteLearningPlanGoalProgresses(
        {
          ids: [
            learningPlanGoalProgresses[0].id,
            learningPlanGoalProgresses[1].id
          ]
        }
      );
      const result = reducer(startState, action);
      expect(result).toEqual(createState([learningPlanGoalProgresses[2]]));
    });
  });

  describe('clear action', () => {
    it('should clear the learningPlanGoalProgresses collection', () => {
      const startState = createState(
        learningPlanGoalProgresses,
        true,
        'something went wrong'
      );
      const action = new LearningPlanGoalProgressActions.ClearLearningPlanGoalProgresss();
      const result = reducer(startState, action);
      expect(result).toEqual(createState([], true, 'something went wrong'));
    });
  });
});
