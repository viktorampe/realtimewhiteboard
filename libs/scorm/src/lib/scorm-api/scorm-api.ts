import { Subject } from 'rxjs';
import {
  ScormApiInterface,
  ScormCmiInterface,
  ScormCmiMode,
  ScormErrorCodes,
  ScormStatus
} from './scorm-api.interface';

export class ScormApi implements ScormApiInterface {
  lastErrorCode: ScormErrorCodes = ScormErrorCodes.NO_ERROR;
  lastDiagnosticMessage = '';
  connectedStatus = true;

  /**
   * Stream that emits when the CMI data model needs to be saved to the server.
   *
   * @memberof ScormApi
   */
  commit$ = new Subject<ScormCmiInterface>();

  /**
   * Stream that emits when the CMI data model has changed.
   * Used to updated the state.
   *
   * @memberof ScormApi
   */
  cmi$ = new Subject<ScormCmiInterface>();

  constructor(
    private currentResult: ScormCmiInterface | any,
    private mode: ScormCmiMode
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
    if (this.mode === ScormCmiMode.CMI_MODE_PREVIEW) {
      this.currentResult = this.getNewCmi();
    } else {
      if (this.currentResult) {
        if (typeof this.currentResult === 'string') {
          try {
            this.currentResult = JSON.parse(this.currentResult);
          } catch (error) {
            this.lastErrorCode = ScormErrorCodes.NOT_INITIALIZED_ERROR;
            this.lastDiagnosticMessage = this.LMSGetErrorString(
              this.lastErrorCode
            );

            return 'false';
          }
        }
      } else {
        this.currentResult = this.getNewCmi();
      }
    }

    this.currentResult.mode = this.mode;
    this.lastErrorCode = ScormErrorCodes.NO_ERROR;
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
    if (this.mode === ScormCmiMode.CMI_MODE_PREVIEW) {
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

    if (value !== undefined) {
      this.lastErrorCode = ScormErrorCodes.NO_ERROR;
      return value;
    }

    // no parameter available, pity
    this.lastErrorCode = ScormErrorCodes.NOT_IMPLEMENTED_ERROR;
    this.lastDiagnosticMessage = `Deze info (${parameter}) is niet beschikbaar`;
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
    if (this.mode === ScormCmiMode.CMI_MODE_PREVIEW) {
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
    if (this.mode === ScormCmiMode.CMI_MODE_PREVIEW) {
      return 'false';
    }

    this.commit$.next(this.currentResult);
    return 'true';
  }
  /**
   * Get the code for the last error occured.
   *
   * @returns
   * @memberof ScormApi
   */
  LMSGetLastError(): ScormErrorCodes {
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
   * @param {ScormErrorCodes} code code that identifies the error message
   * @returns {String} CMIErrorMessage
   * @memberof ScormApi
   */
  LMSGetErrorString(code: ScormErrorCodes): string {
    switch (code) {
      case ScormErrorCodes.NO_ERROR:
        return 'Geen vuiltje aan de lucht...';
      case ScormErrorCodes.INVALID_ARGUMENT_ERROR:
        return 'Foutief argument:';
      case ScormErrorCodes.ELEMENT_CANNOT_HAVE_CHILDREN_ERROR:
        return 'Dit element heeft geen _children';
      case ScormErrorCodes.ELEMENT_CANNOT_HAVE_COUNT_ERROR:
        return 'Dit element heeft geen _count';
      case ScormErrorCodes.NOT_INITIALIZED_ERROR:
        return 'De oefening werd niet correct opgestart';
      case ScormErrorCodes.NOT_IMPLEMENTED_ERROR:
        return 'Deze feature werd niet geïmplementeerd door het LMS';
      case ScormErrorCodes.INVALID_SET_VALUE_ELEMENT_IS_KEYWORD_ERROR:
        return 'Je kan geen waardes zetten voor keywords';
      case ScormErrorCodes.READ_ONLY_ERROR:
        return 'Dit element is alleen-lezen';
      case ScormErrorCodes.WRITE_ONLY_ERROR:
        return 'Dit element is alleen-schrijven';
      case ScormErrorCodes.INCORRECT_DATA_TYPE_ERROR:
        return 'De waarde die je wil schrijven is niet geldig';
      default:
        return 'Algemene fout:';
    }
  }

  private getNewCmi(): ScormCmiInterface {
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
    if (this.mode === ScormCmiMode.CMI_MODE_PREVIEW) {
      return true;
    }

    const cool = this.currentResult !== null;

    if (!cool) {
      this.lastErrorCode = ScormErrorCodes.NOT_INITIALIZED_ERROR;
    }
    this.lastDiagnosticMessage = this.LMSGetErrorString(this.lastErrorCode);
    return cool;
  }

  private getReferenceFromDotString(
    parameter: string,
    exercise: ScormCmiInterface
  ) {
    function index(obj, i) {
      if (obj === undefined) {
        return;
      }
      return obj[i];
    }
    return parameter.split('.').reduce(index, exercise);
  }

  private setReferenceFromDotString(
    parameter: string,
    value: string,
    exercise: ScormCmiInterface
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
    this.lastErrorCode = ScormErrorCodes.NOT_INITIALIZED_ERROR;
    this.lastDiagnosticMessage = 'De oefening werd niet correct opgestart.';
    this.connectedStatus = true;
  }
}
