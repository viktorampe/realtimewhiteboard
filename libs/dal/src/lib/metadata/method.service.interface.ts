import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { MethodInterface } from '../+models';

export const METHOD_SERVICE_TOKEN = new InjectionToken('MethodService');

export interface MethodServiceInterface {
  getAllForUser(userId: number): Observable<MethodInterface[]>;
  getAllowedMethodIds(userId: number): Observable<number[]>;
}
