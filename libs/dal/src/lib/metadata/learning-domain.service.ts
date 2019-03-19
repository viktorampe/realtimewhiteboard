import { Injectable } from '@angular/core';
import { LearningDomainApi } from '@diekeure/polpo-api-angular-sdk';
import { Observable } from 'rxjs';
import { LearningDomainInterface } from '../+models';
import { LearningDomainServiceInterface } from './learning-domain.service.interface';

@Injectable({
  providedIn: 'root'
})
export class LearningDomainService implements LearningDomainServiceInterface {
  constructor(private learningDomainApi: LearningDomainApi) {}

  getAll(): Observable<LearningDomainInterface[]> {
    return this.learningDomainApi.find<LearningDomainInterface>();
  }
}
