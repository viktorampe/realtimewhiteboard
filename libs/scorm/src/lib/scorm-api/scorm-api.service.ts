import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// TODO: remove these interfaces when all scorm related code is merged
export enum ScormCMIMode {
  CMI_MODE_NORMAL = 'normal',
  CMI_MODE_BROWSE = 'browse',
  CMI_MODE_REVIEW = 'review',
  CMI_MODE_PREVIEW = 'preview'
}

export enum ScormStatus {
  STATUS_INCOMPLETE = 'incomplete',
  STATUS_COMPLETED = 'completed',
  STATUS_PASSED = 'passed',
  STATUS_FAILED = 'failed',
  STATUS_BROWSED = 'browsed',
  STATUS_NOT_ATTEMPTED = 'not attempted'
}

enum ErrorCodes {
  NO_ERROR = '0',
  GENERAL_ERROR = '101',
  INVALID_ARGUMENT_ERROR = '',
  ELEMENT_CANNOT_HAVE_CHILDREN_ERROR = '',
  ELEMENT_CANNOT_HAVE_COUNT_ERROR = '',
  NOT_INITIALIZED_ERROR = '',
  NOT_IMPLEMENTED_ERROR = '',
  INVALID_SET_VALUE_ELEMENT_IS_KEYWORD_ERROR = '',
  READ_ONLY_ERROR = '',
  WRITE_ONLY_ERROR = '',
  INCORRECT_DATA_TYPE_ERROR = ''
}

export interface CmiInterface {
  mode: ScormCMIMode;
  core: {
    score: {
      raw: number;
      min?: number; //undefined
      max?: number; //undefined
    };
    lesson_location?: string; //''
    lesson_status: ScormStatus;
    total_time: string; //'0000:00:00'
    session_time?: string; //'0000:00:00'
  };
  objectives?: {
    score: {
      raw: number; //0
      min: number; //undefined
      max: number; //undefined
      scale: any; //undefined
    };
    status: ScormStatus;
    id: string; //'points'
  }[];
  suspend_data?: {
    startTime: number;
    endTime: number;
  }[];
}

export interface ScormApiInterface {
  LMSInitialize(): 'true' | 'false';
  LMSFinish(): 'true' | 'false';
  LMSGetValue(value: string): 'false' | string;
  LMSSetValue(): string;
  LMSCommit(): string;
  LMSGetLastError(): string;
  LMSGetErrorString(code: string): string;
  LMSGetDiagnostic(): string;
}
@Injectable({
  providedIn: 'root'
})
export class ScormApiService {
  private window = window; //TODO: replace with injected window from window service

  cmi$: Observable<{
    score: number;
    time: number;
    status: string;
    cmi: CmiInterface;
  }>;

  constructor() {}

  init(mode: ScormCMIMode) {
    const API = new ScormApiInterface(mode);

    this.window['API'] = API;
  }
}

export class ScormApiInterface implements ScormApiInterface {
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

  LMSGetValue(value: string): 'false' | string {}

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

  private setCurrentEduContent(eduContent, result) {
    this.currentEduContent = eduContent;
    this.currentResult = result;
  }
}
