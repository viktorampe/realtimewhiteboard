import { CurrentExerciseQueries } from '.';
import { CurrentExerciseFixture } from './../../+fixtures/CurrentExercise.fixture';
import {
  CurrentExerciseInterface,
  NAME,
  State
} from './current-exercise.reducer';

describe('Exercise Selectors', () => {
  function createState(
    exercise: CurrentExerciseInterface,
    loaded: boolean = false,
    error?: any
  ): State {
    return {
      ...exercise,
      loaded: loaded,
      error: error
    };
  }

  let exerciseState: State;
  let storeState: any;

  describe('Exercise Selectors', () => {
    beforeEach(() => {
      const mockExercise = new CurrentExerciseFixture();

      exerciseState = createState(mockExercise, true, 'no error');
      storeState = { [NAME]: exerciseState };
    });
    it('getError() should return the error', () => {
      const results = CurrentExerciseQueries.getError(storeState);
      expect(results).toBe(exerciseState.error);
    });
    it('getLoaded() should return the loaded boolean', () => {
      const results = CurrentExerciseQueries.getLoaded(storeState);
      expect(results).toBe(exerciseState.loaded);
    });
    it('getCurrentExercise() should return the current exercise', () => {
      const results = CurrentExerciseQueries.getCurrentExercise(storeState);
      expect(results).toBe(exerciseState as CurrentExerciseInterface);
    });
  });
});
