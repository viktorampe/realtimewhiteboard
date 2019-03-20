import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { LearningDomainInterface } from '../+models';

export const LEARNING_DOMAIN_SERVICE_TOKEN = new InjectionToken(
  'LearningDomainService'
);

export interface LearningDomainServiceInterface {
  getAll(): Observable<LearningDomainInterface[]>;
}
