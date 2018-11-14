import { ExerciseActions } from '.';
import { ExerciseInterface } from '../../+models';
import { initialState, reducer, State } from './current-exercise.reducer';

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
let mockExercise: ExerciseInterface;

describe('Exercises Reducer', () => {
  beforeEach(() => {
    mockExercise = {
      eduContent: undefined,
      cmiMode: 'normal',
      result: undefined,
      saveToApi: true,
      url: 'dit is een url'
    };
  });

  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });

  describe('loaded action', () => {
    it('should load all exercises', () => {
      const action = new ExerciseActions.CurrentExerciseLoaded(mockExercise);
      const result = reducer(initialState, action);
      expect(result).toEqual(createState(mockExercise, true));
    });

    it('should error', () => {
      const error = 'Something went wrong';
      const action = new ExerciseActions.CurrentExerciseError(error);
      const result = reducer(initialState, action);
      expect(result).toEqual(createState(null, false, error));
    });
  });

  describe('clear action', () => {
    it('should clear the current exercise', () => {
      const startState = createState(
        mockExercise,
        true,
        'something went wrong'
      );
      const action = new ExerciseActions.ClearCurrentExercise();
      const result = reducer(startState, action);
      expect(result).toEqual(createState(null, true, 'something went wrong'));
    });
  });
});
