import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { DiaboloPhaseInterface } from '../+models';

export const DIABOLO_PHASE_SERVICE_TOKEN = new InjectionToken(
  'DiaboloPhaseService'
);

export interface DiaboloPhaseServiceInterface {
  getAll(): Observable<DiaboloPhaseInterface[]>;
}
