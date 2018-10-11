import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { EduContentInterface } from '../+models/EduContent.interface';

export const EDUCONTENT_SERVICE_TOKEN = new InjectionToken('EduContentService');
export interface EduContentServiceInterface {
  getAllForUser(userId: number): Observable<EduContentInterface[]>;
}
