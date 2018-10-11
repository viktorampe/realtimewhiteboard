import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { LearningAreaInterface } from '../+models/LearningArea.interface';

export const LEARNINGAREA_SERVICE_TOKEN = new InjectionToken(
  'LearningAreaService'
);
export interface LearningAreaServiceInterface {
  getAll(): Observable<LearningAreaInterface[]>;
}
