import { EduContentInterface, ResultInterface } from '@campus/dal';
import { ScormCmiMode } from '@campus/scorm';
import {
  CurrentExerciseActions,
  CurrentExerciseActionTypes
} from './current-exercise.actions';

export const NAME = 'currentExercise';

export interface CurrentExerciseInterface {
  eduContent?: EduContentInterface;
  cmiMode: ScormCmiMode;
  result?: ResultInterface;
  saveToApi: boolean;
  url: string;
}
export interface State extends CurrentExerciseInterface {
  error?: any;
}

export const initialState: State = {
  eduContent: null,
  cmiMode: null,
  result: null,
  saveToApi: null,
  url: null
};

export function reducer(
  state = initialState,
  action: CurrentExerciseActions
): State {
  switch (action.type) {
    case CurrentExerciseActionTypes.ClearCurrentExercise: {
      return {
        ...state,
        eduContent: null,
        cmiMode: null,
        result: null,
        saveToApi: null,
        url: null
      };
    }

    case CurrentExerciseActionTypes.SaveCurrentExercise: {
      return {
        ...state,
        ...action.payload.exercise
      };
    }

    case CurrentExerciseActionTypes.CurrentExerciseLoaded: {
      return {
        ...state,
        ...action.payload
      };
    }

    case CurrentExerciseActionTypes.CurrentExerciseError: {
      return {
        ...state,
        eduContent: null,
        cmiMode: null,
        result: null,
        saveToApi: null,
        url: null,
        error: action.payload
      };
    }

    default: {
      return state;
    }
  }
}
