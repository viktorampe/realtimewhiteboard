import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { ScormCMIMode } from '.';
import { CmiInterface } from './scorm-api.interface';

export const SCORM_API_SERVICE_TOKEN = new InjectionToken('ScormApiService');

export interface ScormApiServiceInterface {
  commit$: Observable<any>;
  cmi$: Observable<CmiInterface>;
  init(cmi: CmiInterface, mode: ScormCMIMode): void;
}
