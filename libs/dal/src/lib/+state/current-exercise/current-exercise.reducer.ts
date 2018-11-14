import { EduContentInterface, ResultInterface } from '@campus/dal';
import { ScormCMIMode } from '../../exercise/exercise.service';
import {
  CurrentExerciseActions,
  CurrentExerciseActionTypes
} from './current-exercise.actions';

export const NAME = 'currentExercise';

export interface State extends CurrentExerciseInterface {
  loaded: boolean;
  error?: any;
}

export interface CurrentExerciseInterface {
  eduContent: EduContentInterface;
  cmiMode: ScormCMIMode;
  result: ResultInterface;
  saveToApi: boolean;
  url: string;
}

export const initialState: State = {
  eduContent: null,
  cmiMode: null,
  result: null,
  saveToApi: null,
  url: null,
  loaded: false
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
        url: null,
        loaded: true
      };
    }

    case CurrentExerciseActionTypes.CurrentExerciseLoaded: {
      return {
        ...state,
        eduContent: action.payload.eduContent,
        cmiMode: action.payload.cmiMode,
        result: action.payload.result,
        saveToApi: action.payload.saveToApi,
        url: action.payload.url,
        loaded: true
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
        error: action.payload,
        loaded: false
      };
    }

    default: {
      return state;
    }
  }
}
