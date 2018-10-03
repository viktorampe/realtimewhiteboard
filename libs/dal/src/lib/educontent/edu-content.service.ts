import { Injectable, InjectionToken } from '@angular/core';
import { EduContentApi } from '@diekeure/polpo-api-angular-sdk';

export const EDUCONTENT_SERVICE_TOKEN = new InjectionToken('EducontentService');

@Injectable({
  providedIn: 'root'
})
export class EduContentService {
  constructor(private EducontentApi: EduContentApi) {}
}
