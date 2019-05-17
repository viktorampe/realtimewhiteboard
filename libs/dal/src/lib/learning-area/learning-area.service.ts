import { Injectable } from '@angular/core';
import { LearningAreaApi } from '@diekeure/polpo-api-angular-sdk';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LearningAreaInterface } from '../+models/LearningArea.interface';
import { LearningAreaServiceInterface } from './learning-area.service.interface';

@Injectable({
  providedIn: 'root'
})
export class LearningAreaService implements LearningAreaServiceInterface {
  constructor(private learningAreaApi: LearningAreaApi) {}

  getAll(): Observable<LearningAreaInterface[]> {
    return this.learningAreaApi
      .find<LearningAreaInterface>({})
      .pipe(map(learningAreas => learningAreas.map(this.addIconPrefix)));
  }

  // TODO: remove when DB is updated
  private addIconPrefix(
    learningArea: LearningAreaInterface
  ): LearningAreaInterface {
    if (learningArea.icon && !learningArea.icon.startsWith('learning-area:')) {
      return { ...learningArea, icon: 'learning-area:' + learningArea.icon };
    }

    return learningArea;
  }
}
