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
 * Utility to create the EffectFeedback state.
 *
 * @param {EffectFeedbackInterface[]} effectFeedback
 * @param {*} [error]
 * @returns {State}
 */
function createEffectFeedbackState(
  effectFeedback: EffectFeedbackInterface[],
  error?: any
): State {
  const state: any = {
    ids: effectFeedback ? effectFeedback.map(feedback => feedback.id) : [],
    entities: effectFeedback
      ? effectFeedback.reduce(
          (entityMap, feedback) => ({
            ...entityMap,
            [feedback.id]: feedback
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
      runCompareTest(
        { priority: Priority.HIGH, timeStamp: 1 },
        { priority: Priority.NORM, timeStamp: 1 },
        -1
      );
      runCompareTest(
        { priority: Priority.HIGH, timeStamp: 1 },
        { priority: Priority.LOW, timeStamp: 1 },
        -2
      );
      runCompareTest(
        { priority: Priority.HIGH, timeStamp: 1 },
        { priority: Priority.HIGH, timeStamp: 1 },
        0
      );
      runCompareTest(
        { priority: Priority.NORM, timeStamp: 1 },
        { priority: Priority.HIGH, timeStamp: 1 },
        1
      );
      runCompareTest(
        { priority: Priority.NORM, timeStamp: 1 },
        { priority: Priority.LOW, timeStamp: 1 },
        -1
      );
      runCompareTest(
        { priority: Priority.NORM, timeStamp: 1 },
        { priority: Priority.NORM, timeStamp: 1 },
        0
      );
      runCompareTest(
        { priority: Priority.LOW, timeStamp: 1 },
        { priority: Priority.HIGH, timeStamp: 1 },
        2
      );
      runCompareTest(
        { priority: Priority.LOW, timeStamp: 1 },
        { priority: Priority.NORM, timeStamp: 1 },
        1
      );
      runCompareTest(
        { priority: Priority.LOW, timeStamp: 1 },
        { priority: Priority.LOW, timeStamp: 1 },
        0
      );
    });

    it('should sort by timestamp level (equal priorities)', () => {
      runCompareTest(
        { priority: Priority.HIGH, timeStamp: 1 },
        { priority: Priority.HIGH, timeStamp: 2 },
        -1
      );
      runCompareTest(
        { priority: Priority.HIGH, timeStamp: 2 },
        { priority: Priority.HIGH, timeStamp: 1 },
        1
      );
      runCompareTest(
        { priority: Priority.HIGH, timeStamp: 1 },
        { priority: Priority.HIGH, timeStamp: 1 },
        0
      );
    });

    it('should sort the ids by priority level, then by timestamp (oldest first)', () => {
      const unsortedEffectFeedbacks = [
        new EffectFeedbackFixture({
          id: 'guidLOW1',
          priority: Priority.LOW,
          timeStamp: 0
        }),
        new EffectFeedbackFixture({
          id: 'guidNORM',
          priority: Priority.NORM,
          timeStamp: 2
        }),
        new EffectFeedbackFixture({
          id: 'guidHIGH2',
          priority: Priority.HIGH,
          timeStamp: 4
        }),
        new EffectFeedbackFixture({
          id: 'guidHIGH1',
          priority: Priority.HIGH,
          timeStamp: 3
        }),
        new EffectFeedbackFixture({
          id: 'guidLOW2',
          priority: Priority.LOW,
          timeStamp: 1
        })
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

  function runCompareTest(
    a: { priority: Priority; timeStamp: number },
    b: { priority: Priority; timeStamp: number },
    result: number
  ) {
    expect(
      sortByPriority(a as EffectFeedbackInterface, b as EffectFeedbackInterface)
    ).toBe(result);
  }
});
