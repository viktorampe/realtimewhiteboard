import { InjectionToken } from '@angular/core';
import { ScormCMIMode } from '.';

export const SCORM_API_SERVICE_TOKEN = new InjectionToken('ScormApiService');

export interface ScormApiServiceInterface {
  init(mode: ScormCMIMode);
}
