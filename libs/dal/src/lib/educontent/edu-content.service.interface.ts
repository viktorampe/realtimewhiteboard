import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { EduContentInterface } from '../+models/EduContent.interface';

export const EDUCONTENT_SERVICE_TOKEN = new InjectionToken('EducontentService');
export interface EducontentServiceInterface {
  getAll(): Observable<EduContentInterface[]>;
}
