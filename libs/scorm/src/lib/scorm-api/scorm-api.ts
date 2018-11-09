import { Subject } from 'rxjs';
import {
  CmiInterface,
  ScormApiInterface,
  ScormCMIMode,
  ScormStatus
} from './scorm-api.interface';

export enum ErrorCodes {
  NO_ERROR = '0',
  GENERAL_ERROR = '101',
  INVALID_ARGUMENT_ERROR = '201',
  ELEMENT_CANNOT_HAVE_CHILDREN_ERROR = '202',
  ELEMENT_CANNOT_HAVE_COUNT_ERROR = '203',
  NOT_INITIALIZED_ERROR = '301',
  NOT_IMPLEMENTED_ERROR = '401',
  INVALID_SET_VALUE_ELEMENT_IS_KEYWORD_ERROR = '402',
  READ_ONLY_ERROR = '403',
  WRITE_ONLY_ERROR = '404',
  INCORRECT_DATA_TYPE_ERROR = '405'
}

export class ScormApi implements ScormApiInterface {
  lastErrorCode: ErrorCodes = ErrorCodes.NO_ERROR;
  lastDiagnosticMessage = '';
  connectedStatus = true;
  commit$ = new Subject<{
    score: number;
    time: number;
    status: string;
    cmi: CmiInterface;
  }>();
  cmi$ = new Subject<CmiInterface>();

  constructor(
    private currentResult: CmiInterface,
    private mode: ScormCMIMode
  ) {}

  /**
   * Initialize the API and exercise.
   *
   * Resets the API, reads the right data from the window object
   * and sets the default values for the CMI data model.
   *
   * @returns {('true' | 'false')}
   * @memberof ScormApi
   */
  LMSInitialize(): 'true' | 'false' {
    this.reset();
    //check exerciseId and exercise info availability
    if (this.mode === ScormCMIMode.CMI_MODE_PREVIEW) {
      this.currentResult = this.getNewCmi();
    } else {
      if (this.currentResult) {
        if (typeof this.currentResult === 'string') {
          this.currentResult = JSON.parse(this.currentResult);
        }
      } else {
        this.currentResult = this.getNewCmi();
      }
    }

    this.currentResult.mode = this.mode;
    this.lastErrorCode = ErrorCodes.NO_ERROR;
    this.lastDiagnosticMessage = this.LMSGetErrorString(this.lastErrorCode);

    return 'true';
  }

  /**
   * Finish the exercise.
   *
   * Saves the data to the server, removes the exercise window from above the game.
   *
   * @returns {('true' | 'false')}
   * @memberof ScormApiInterface
   */
  LMSFinish(): 'true' | 'false' {
    //check exerciseId and exercise info availability
    if (this.mode === ScormCMIMode.CMI_MODE_PREVIEW) {
      return 'true';
    }

    this.LMSCommit();

    if (this.checkInitialized() === false) {
      return 'false';
    }

    if (
      this.currentResult.core.lesson_status !== ScormStatus.STATUS_COMPLETED
    ) {
      return 'false';
    }

    return 'true';
  }
  /**
   * Get a value for the CMI Data Model
   *
   * @param {string} parameter the CMI Element identifier
   * @returns {('false' | string)} value for the requested CMI Element or 'false' if the value is not found
   * @memberof ScormApi
   */
  LMSGetValue(parameter: string): 'false' | string {
    if (this.checkInitialized() === false) {
      return 'false';
    }

    const value = this.getReferenceFromDotString(parameter, this.currentResult);

    if (parameter !== undefined) {
      this.lastErrorCode = ErrorCodes.NO_ERROR;
      return parameter;
    }

    // no parameter available, pity
    this.lastErrorCode = ErrorCodes.NOT_IMPLEMENTED_ERROR;
    this.lastDiagnosticMessage =
      'Deze info (' + parameter + ') is niet beschikbaar';
    return 'false';
  }

  /**
   * Sets a value for the CMI Data Model
   *
   * @param {string} parameter the CMI Element identifier
   * @param {string} value the value for the CMI Element identifier
   * @returns {('true' | 'false')}
   * @memberof ScormApi
   */
  LMSSetValue(parameter: string, value: string): 'true' | 'false' {
    //check exerciseId and exercise info availability
    if (this.mode === ScormCMIMode.CMI_MODE_PREVIEW) {
      return 'false';
    }

    if (this.checkInitialized() === false) {
      return 'false';
    }

    this.setReferenceFromDotString(parameter, value, this.currentResult);

    this.cmi$.next(this.currentResult);

    return 'true';
  }
  /**
   * Commits the CMI Data Model to the server.
   *
   * @returns {('true' | 'false')}
   * @memberof ScormApi
   */
  LMSCommit(): 'true' | 'false' {
    if (this.checkInitialized() === false) {
      return 'false';
    }

    //check exerciseId and exercise info availability
    if (this.mode === ScormCMIMode.CMI_MODE_PREVIEW) {
      return 'false';
    }

    this.commit$.next(this.createCommitData());
    return 'true';
  }
  /**
   * Get the code for the last error occured.
   *
   * @returns
   * @memberof ScormApi
   */
  LMSGetLastError(): ErrorCodes {
    return this.lastErrorCode;
  }
  /**
   * Get the detailed message for the last errorcode.
   *
   * @returns {string}
   * @memberof ScormApi
   */
  LMSGetDiagnostic(): string {
    return this.lastDiagnosticMessage;
  }

  /**
   * Get a short description for the specified errorCode
   *
   * @param {ErrorCodes} code code that identifies the error message
   * @returns {String} CMIErrorMessage
   * @memberof ScormApi
   */
  LMSGetErrorString(code: ErrorCodes): string {
    let errorString = '';
    switch (code) {
      case ErrorCodes.NO_ERROR:
        errorString = 'Geen vuiltje aan de lucht...';
        break;
      case ErrorCodes.INVALID_ARGUMENT_ERROR:
        errorString = 'Foutief argument:';
        break;
      case ErrorCodes.ELEMENT_CANNOT_HAVE_CHILDREN_ERROR:
        errorString = 'Dit element heeft geen _children';
        break;
      case ErrorCodes.ELEMENT_CANNOT_HAVE_COUNT_ERROR:
        errorString = 'Dit element heeft geen _count';
        break;
      case ErrorCodes.NOT_INITIALIZED_ERROR:
        errorString = 'De oefening werd niet correct opgestart';
        break;
      case ErrorCodes.NOT_IMPLEMENTED_ERROR:
        errorString = 'Deze feature werd niet geïmplementeerd door het LMS';
        break;
      case ErrorCodes.INVALID_SET_VALUE_ELEMENT_IS_KEYWORD_ERROR:
        errorString = 'Je kan geen waardes zetten voor keywords';
        break;
      case ErrorCodes.READ_ONLY_ERROR:
        errorString = 'Dit element is alleen-lezen';
        break;
      case ErrorCodes.WRITE_ONLY_ERROR:
        errorString = 'Dit element is alleen-schrijven';
        break;
      case ErrorCodes.INCORRECT_DATA_TYPE_ERROR:
        errorString = 'De waarde die je wil schrijven is niet geldig';
        break;
      default:
        errorString = 'Algemene fout:';
        break;
    }
    return errorString;
  }

  private getNewCmi(): CmiInterface {
    return {
      mode: this.mode,
      core: {
        score: {
          raw: 0,
          min: undefined,
          max: undefined
        },
        lesson_location: '',
        lesson_status: ScormStatus.STATUS_NOT_ATTEMPTED,
        total_time: '0000:00:00',
        session_time: '0000:00:00'
      },
      objectives: [
        {
          score: {
            raw: 0,
            min: undefined,
            max: undefined,
            scale: undefined
          },
          status: ScormStatus.STATUS_NOT_ATTEMPTED,
          id: 'points'
        }
      ],
      suspend_data: []
    };
  }

  private checkInitialized(): boolean {
    if (this.mode === ScormCMIMode.CMI_MODE_PREVIEW) {
      return true;
    }

    const cool = this.currentResult !== null;

    if (!cool) {
      this.lastErrorCode = ErrorCodes.NOT_INITIALIZED_ERROR;
    }
    this.lastDiagnosticMessage = this.LMSGetErrorString(this.lastErrorCode);
    return cool;
  }

  private getReferenceFromDotString(parameter: string, exercise: CmiInterface) {
    function index(obj, i) {
      if (obj === undefined) {
        return undefined;
      }
      return obj[i];
    }

    return parameter.split('.').reduce(index, exercise);
  }

  private setReferenceFromDotString(
    parameter: string,
    value: string,
    exercise: CmiInterface
  ) {
    function index(obj, i, currentIndex, arr) {
      if (obj === undefined) {
        throw new Error('cannot set value of property ' + i + ' on undefined');
      }
      if (/^\d+$/.test(i)) {
        i = parseInt(i, 10);
      }
      if (currentIndex === arr.length - 1) {
        obj[i] = value;
      }
      return obj[i];
    }

    return parameter.split('.').reduce(index, exercise);
  }

  private reset() {
    this.lastErrorCode = ErrorCodes.NOT_INITIALIZED_ERROR;
    this.lastDiagnosticMessage = 'De oefening werd niet correct opgestart.';
    this.connectedStatus = true;
  }

  private createCommitData(): {
    score: number;
    time: number;
    status: string;
    cmi: CmiInterface;
  } {
    const timepieces = this.LMSGetValue('cmi.core.total_time').split(':');
    const timespan =
      parseInt(timepieces[0], 10) * 3600000 +
      parseInt(timepieces[1], 10) * 60000 +
      parseFloat(timepieces[2]) * 1000;
    const data = {
      score: parseInt(this.LMSGetValue('cmi.core.score.raw'), 10),
      time: timespan,
      status: this.LMSGetValue('cmi.core.lesson_status'),
      cmi: this.currentResult
    };

    return data;
  }
}
