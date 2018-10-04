import { initialEducontentState, reducer } from './edu-contents.reducer';

describe('EduContents Reducer', () => {
  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any;

      const result = reducer(initialEducontentState, action);

      expect(result).toBe(initialEducontentState);
    });
  });
});
