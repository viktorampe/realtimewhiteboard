import { ExerciseQueries } from '.';
import { ExerciseInterface } from '../../+models';
import { State } from './current-exercise.reducer';

describe('Exercise Selectors', () => {
  function createState(
    exercise: ExerciseInterface,
    loaded: boolean = false,
    error?: any
  ): State {
    return {
      currentExercise: exercise,
      loaded: loaded,
      error: error
    };
  }

  let exerciseState: State;
  let storeState: any;

  describe('Exercise Selectors', () => {
    beforeEach(() => {
      const mockExercise: ExerciseInterface = {
        eduContent: undefined,
        cmiMode: 'normal',
        result: undefined,
        saveToApi: true,
        url: 'dit is een url'
      };

      exerciseState = createState(mockExercise, true, 'no error');
      storeState = { exercises: exerciseState };
    });
    it('getError() should return the error', () => {
      const results = ExerciseQueries.getError(storeState);
      expect(results).toBe(exerciseState.error);
    });
    it('getLoaded() should return the loaded boolean', () => {
      const results = ExerciseQueries.getLoaded(storeState);
      expect(results).toBe(exerciseState.loaded);
    });
    it('getCurrentExercise() should return the current exercise', () => {
      const results = ExerciseQueries.getCurrentExercise(storeState);
      expect(results).toBe(exerciseState.currentExercise);
    });
  });
});
