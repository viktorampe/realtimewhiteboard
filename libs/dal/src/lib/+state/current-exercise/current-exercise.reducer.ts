import { ResultInterface } from '../../+models';
import { ScormCmiMode } from '../../+external-interfaces/scorm-api.interface';
import {
  CurrentExerciseActions,
  CurrentExerciseActionTypes
} from './current-exercise.actions';

export const NAME = 'currentExercise';

export interface CurrentExerciseInterface {
  eduContentId?: number;
  cmiMode: ScormCmiMode;
  result?: ResultInterface;
  saveToApi: boolean;
  url: string;
}
export interface State extends CurrentExerciseInterface {
  error?: any;
}

export const initialState: State = {
  eduContentId: null,
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
    case CurrentExerciseActionTypes.LoadExercise: {
      // reset state, effect will do the rest
      return {
        ...initialState
      };
    }

    case CurrentExerciseActionTypes.ClearCurrentExercise: {
      return {
        ...state,
        eduContentId: null,
        cmiMode: null,
        result: null,
        saveToApi: null,
        url: null
      };
    }

    case CurrentExerciseActionTypes.SaveCurrentExercise: {
      const cmi = JSON.parse(action.payload.exercise.result.cmi);
      return {
        ...state,
        ...action.payload.exercise,
        result: {
          ...action.payload.exercise.result,
          score: cmi ? cmi.core.score.raw : 0,
          time: cmi ? convertCmiTimeStringToNumber(cmi.core.total_time) : 0,
          status: cmi ? cmi.core.lesson_status : 'incomplete'
        }
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
        eduContentId: null,
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

function convertCmiTimeStringToNumber(cmiTimeString: string): number {
  const timepieces = cmiTimeString.split(':');
  const timespan =
    parseInt(timepieces[0], 10) * 3600000 +
    parseInt(timepieces[1], 10) * 60000 +
    parseFloat(timepieces[2]) * 1000;

  return timespan;
}
