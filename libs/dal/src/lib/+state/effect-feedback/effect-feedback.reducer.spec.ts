import { EffectFeedbackActions } from '.';
import { EffectFeedbackFixture } from '../../+fixtures/EffectFeedback.fixture';
import { EffectFeedbackInterface, Priority } from './effect-feedback.model';
import {
  initialState,
  reducer,
  sortByPriority,
  State
} from './effect-feedback.reducer';
// file.only

/**
 * Utility to create the task-edu-content state.
 *
 * @param {TaskEduContentInterface[]} effectFeedback
 * @param {boolean} [loaded]
 * @param {*} [error]
 * @returns {State}
 */
function createState(
  effectFeedback: EffectFeedbackInterface[],
  error?: any
): State {
  const state: any = {
    ids: effectFeedback
      ? effectFeedback.map(taskEduContent => taskEduContent.id)
      : [],
    entities: effectFeedback
      ? effectFeedback.reduce(
          (entityMap, taskEduContent) => ({
            ...entityMap,
            [taskEduContent.id]: taskEduContent
          }),
          {}
        )
      : {}
  };
  if (error !== undefined) state.error = error;
  return state;
}

describe('EffectFeedback Reducer', () => {
  describe('compareFunction', () => {
    it('should sort by priority level', () => {
      runCompareTest(Priority.HIGH, Priority.NORM, -1);
      runCompareTest(Priority.HIGH, Priority.LOW, -1);
      runCompareTest(Priority.HIGH, Priority.HIGH, 0);
      runCompareTest(Priority.NORM, Priority.HIGH, 1);
      runCompareTest(Priority.NORM, Priority.LOW, -1);
      runCompareTest(Priority.NORM, Priority.NORM, 0);
      runCompareTest(Priority.LOW, Priority.HIGH, 1);
      runCompareTest(Priority.LOW, Priority.NORM, 1);
      runCompareTest(Priority.LOW, Priority.LOW, 0);
    });
  });
  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });

  describe('add action', () => {
    it('should add one effectFeedback', () => {
      const effectFeedback = new EffectFeedbackFixture({ id: 'guid' });
      const action = new EffectFeedbackActions.AddEffectFeedback({
        effectFeedback
      });

      const result = reducer(initialState, action);
      expect(result).toEqual(createState([effectFeedback]));
    });
  });

  describe('delete action', () => {
    it('should delete one effectFeedback', () => {
      const effectFeedback = new EffectFeedbackFixture({ id: 'guid' });
      const startState = createState([effectFeedback]);
      const action = new EffectFeedbackActions.DeleteEffectFeedback({
        id: effectFeedback.id
      });

      const result = reducer(startState, action);
      expect(result).toEqual(createState([]));
    });
  });

  function runCompareTest(a: Priority, b: Priority, result: number) {
    expect(
      sortByPriority(
        { priority: a } as EffectFeedbackInterface,
        { priority: b } as EffectFeedbackInterface
      )
    ).toBe(result);
  }
});
