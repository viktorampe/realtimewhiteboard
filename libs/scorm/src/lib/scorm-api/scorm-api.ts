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
  currentUser: any = null; // TODO: check if this is necessary?
  currentResult: { cmi: CmiInterface };
  currentEduContent: any = null;
  lastErrorCode: ErrorCodes = ErrorCodes.NO_ERROR;
  lastDiagnosticMessage = '';

  constructor(private mode: ScormCMIMode) {}

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
    //check exerciseId and exercise info availability
    if (this.mode === ScormCMIMode.CMI_MODE_PREVIEW) {
      this.currentResult = { cmi: this.getNewCmi() };
    } else {
      if (!this.currentEduContent) {
        this.lastErrorCode = ErrorCodes.GENERAL_ERROR;
        this.lastDiagnosticMessage =
          'Geen oefening-info beschikbaar, probeer aub opnieuw...';
        return 'false';
      }

      if (this.currentResult.cmi) {
        if (typeof this.currentResult.cmi === 'string') {
          this.currentResult.cmi = JSON.parse(this.currentResult.cmi);
        }
      } else {
        this.currentResult.cmi = this.getNewCmi();
      }
    }

    this.currentResult.cmi.mode = this.mode;
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
      this.currentResult.cmi.core.lesson_status !== ScormStatus.STATUS_COMPLETED
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

    this.LMSCommit();

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

    //TODO:  dispatches SAVE_EXERCISE_RESULT_ACTION, depending on mode, with debounce functionality.
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

    const cool =
      this.currentEduContent !== null &&
      this.currentResult !== null &&
      this.currentUser !== null;
    if (!cool) {
      this.lastErrorCode = ErrorCodes.NOT_INITIALIZED_ERROR;
    }
    this.lastDiagnosticMessage = this.LMSGetErrorString(this.lastErrorCode);
    return cool;
  }

  private getReferenceFromDotString(parameter: string, exercise: any) {
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
    exercise: any
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
}
