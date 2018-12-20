import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { ScormCmiMode } from '.';

export const SCORM_API_SERVICE_TOKEN = new InjectionToken('ScormApiService');

export interface ScormApiServiceInterface {
  commit$: Observable<string>;
  cmi$: Observable<string>;
  init(cmi: string, mode: ScormCmiMode): void;
}
