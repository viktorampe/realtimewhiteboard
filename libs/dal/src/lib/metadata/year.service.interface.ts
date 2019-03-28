import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { YearInterface } from '../+models';

export const YEAR_SERVICE_TOKEN = new InjectionToken('YearService');

export interface YearServiceInterface {
  getAll(): Observable<YearInterface[]>;
}
