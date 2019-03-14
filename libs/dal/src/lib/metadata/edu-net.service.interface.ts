import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { EduNetInterface } from '../+models';

export const EDU_NET_SERVICE_TOKEN = new InjectionToken('EduNetService');

export interface EduNetServiceInterface {
  getAll(): Observable<EduNetInterface[]>;
}
