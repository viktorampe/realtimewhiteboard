import { ErrorCodes } from './scorm-api';

export interface ScormApiInterface {
  LMSInitialize(): 'true' | 'false';
  LMSFinish(): 'true' | 'false';
  LMSGetValue(parameter: string): 'false' | string;
  LMSSetValue(parameter: string, value: string): 'true' | 'false';
  LMSCommit(): string;
  LMSGetLastError(): ErrorCodes;
  LMSGetErrorString(code: string): string;
  LMSGetDiagnostic(): string;
}

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
