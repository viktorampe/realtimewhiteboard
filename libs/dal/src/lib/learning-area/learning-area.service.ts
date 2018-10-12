import { Injectable } from '@angular/core';
import { LearningAreaApi } from '@diekeure/polpo-api-angular-sdk';
import { Observable } from 'rxjs';
import { LearningAreaInterface } from '../+models/LearningArea.interface';
import { LearningAreaServiceInterface } from './learning-area.service.interface';

@Injectable({
  providedIn: 'root'
})
export class LearningAreaService implements LearningAreaServiceInterface {
  constructor(private learningAreaApi: LearningAreaApi) {}

  getAll(): Observable<LearningAreaInterface[]> {
    return this.learningAreaApi.find<LearningAreaInterface>({});
  }
}
