import { EffectFeedbackInterface, Priority } from './effect-feedback.model';
import {
  initialState,
  reducer,
  sortByPriority
} from './effect-feedback.reducer';
// file.only
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

  function runCompareTest(a: Priority, b: Priority, result: number) {
    expect(
      sortByPriority(
        { priority: a } as EffectFeedbackInterface,
        { priority: b } as EffectFeedbackInterface
      )
    ).toBe(result);
  }
});
