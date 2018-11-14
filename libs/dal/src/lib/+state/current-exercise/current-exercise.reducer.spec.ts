import { CurrentExerciseActions } from '.';
import { ScormCMIMode } from '../../exercise/exercise.service';
import {
  CurrentExerciseInterface,
  initialState,
  reducer,
  State
} from './current-exercise.reducer';

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
let mockExercise: CurrentExerciseInterface;
let emptyExercise: CurrentExerciseInterface;

describe('Exercises Reducer', () => {
  beforeEach(() => {
    mockExercise = {
      eduContent: undefined,
      cmiMode: ScormCMIMode.CMI_MODE_NORMAL,
      result: undefined,
      saveToApi: true,
      url: 'dit is een url'
    };

    emptyExercise = {
      eduContent: null,
      cmiMode: null,
      result: null,
      saveToApi: null,
      url: null
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
      const action = new CurrentExerciseActions.CurrentExerciseLoaded(
        mockExercise
      );
      const result = reducer(initialState, action);
      expect(result).toEqual(createState(mockExercise, true));
    });

    it('should error', () => {
      const error = 'Something went wrong';
      const action = new CurrentExerciseActions.CurrentExerciseError(error);
      const result = reducer(initialState, action);
      expect(result).toEqual(createState(emptyExercise, false, error));
    });
  });

  describe('clear action', () => {
    it('should clear the current exercise', () => {
      const startState = createState(
        mockExercise,
        true,
        'something went wrong'
      );
      const action = new CurrentExerciseActions.ClearCurrentExercise();
      const result = reducer(startState, action);
      expect(result).toEqual(
        createState(emptyExercise, true, 'something went wrong')
      );
    });
  });
});
