import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { ScormCmiMode } from '.';
import { ScormCmiInterface } from './scorm-api.interface';

export const SCORM_API_SERVICE_TOKEN = new InjectionToken('ScormApiService');

export interface ScormApiServiceInterface {
  commit$: Observable<any>;
  cmi$: Observable<ScormCmiInterface>;
  init(cmi: ScormCmiInterface, mode: ScormCmiMode): void;
}
