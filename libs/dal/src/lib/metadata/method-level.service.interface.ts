import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { MethodLevelInterface } from '../+models';

export const METHOD_LEVEL_SERVICE_TOKEN = new InjectionToken(
  'MethodLevelService'
);

export interface MethodLevelServiceInterface {
  getAllForUser(userId: number): Observable<MethodLevelInterface[]>;
}
