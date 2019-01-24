import { EffectFeedbackActions } from '.';
import { EffectFeedbackFixture } from '../../+fixtures/EffectFeedback.fixture';
import { EffectFeedbackInterface, Priority } from './effect-feedback.model';
import {
  initialState,
  reducer,
  sortByPriority,
  State
} from './effect-feedback.reducer';

/**
 * Utility to create the task-edu-content state.
 *
 * @param {TaskEduContentInterface[]} effectFeedback
 * @param {boolean} [loaded]
 * @param {*} [error]
 * @returns {State}
 */
function createEffectFeedbackState(
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

    it('should sort the ids by priority level', () => {
      const unsortedEffectFeedbacks = [
        new EffectFeedbackFixture({ id: 'guidLOW1', priority: Priority.LOW }),
        new EffectFeedbackFixture({ id: 'guidLOW2', priority: Priority.LOW }),
        new EffectFeedbackFixture({ id: 'guidNORM', priority: Priority.NORM }),
        new EffectFeedbackFixture({ id: 'guidHIGH1', priority: Priority.HIGH }),
        new EffectFeedbackFixture({ id: 'guidHIGH2', priority: Priority.HIGH })
      ];

      const sortedIds = unsortedEffectFeedbacks
        .sort(sortByPriority)
        .map(e => e.id);
      expect(sortedIds).toEqual([
        'guidHIGH1',
        'guidHIGH2',
        'guidNORM',
        'guidLOW1',
        'guidLOW2'
      ]);
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
      expect(result).toEqual(createEffectFeedbackState([effectFeedback]));
    });
  });

  describe('delete action', () => {
    it('should delete one effectFeedback', () => {
      const effectFeedback = new EffectFeedbackFixture({ id: 'guid' });
      const startState = createEffectFeedbackState([effectFeedback]);
      const action = new EffectFeedbackActions.DeleteEffectFeedback({
        id: effectFeedback.id
      });

      const result = reducer(startState, action);
      expect(result).toEqual(createEffectFeedbackState([]));
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
