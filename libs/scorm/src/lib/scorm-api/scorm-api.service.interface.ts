import { InjectionToken } from '@angular/core';

export const SCORM_API_SERVICE_TOKEN = new InjectionToken('ScormApiService');

export interface ScormApiServiceInterface {
  LMSInitialize(): 'true' | 'false';
  LMSFinish(): 'true' | 'false';
  LMSGetValue(): 'false' | string;
  LMSSetValue(): string;
  LMSCommit(): string;
  LMSGetLastError(): string;
  LMSGetErrorString(code: string): string;
  LMSGetDiagnostic(): string;
}
