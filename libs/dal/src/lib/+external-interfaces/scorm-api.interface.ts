export interface ScormApiInterface {
  LMSInitialize(): 'true' | 'false';
  LMSFinish(): 'true' | 'false';
  LMSGetValue(parameter: string): 'false' | string;
  LMSSetValue(parameter: string, value: string): 'true' | 'false';
  LMSCommit(): string;
  LMSGetLastError(): ScormErrorCodes;
  LMSGetErrorString(code: string): string;
  LMSGetDiagnostic(): string;
}

export enum ScormErrorCodes {
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

export enum ScormCmiMode {
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

export interface ScormCmiInterface {
  mode: ScormCmiMode;
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
  objectives?: any;
  suspend_data?: any;
}
