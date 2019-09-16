import { CurrentExerciseActions } from '.';
import { CurrentExerciseFixture } from '../../+fixtures';
import { ScormCmiMode } from '../../exercise/scorm-api.interface';
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
    error: error
  };
}
let mockExercise: CurrentExerciseInterface;
let emptyExercise: CurrentExerciseInterface;

describe('Exercises Reducer', () => {
  beforeEach(() => {
    mockExercise = new CurrentExerciseFixture({
      eduContentId: 1,
      cmiMode: ScormCmiMode.CMI_MODE_PREVIEW,
      result: null,
      saveToApi: true,
      url: 'lalalalala'
    });

    emptyExercise = {
      eduContentId: null,
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
    it('should load the exercise', () => {
      const action = new CurrentExerciseActions.CurrentExerciseLoaded(
        mockExercise
      );
      const result = reducer(initialState, action);
      expect(result).toEqual(mockExercise);
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
