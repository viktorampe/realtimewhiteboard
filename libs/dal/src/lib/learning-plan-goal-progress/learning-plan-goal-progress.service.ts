import { Injectable } from '@angular/core';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LearningPlanGoalProgressInterface } from '../+models';

@Injectable({
  providedIn: 'root'
})
export class LearningPlanGoalProgressService {
  constructor(private personApi: PersonApi) {}

  getAllForUser(userId): Observable<LearningPlanGoalProgressInterface[]> {
    return this.personApi
      .getData(userId, 'learningPlanGoalProgress')
      .pipe(
        map(
          (res: {
            learningPlanGoalProgress: LearningPlanGoalProgressInterface[];
          }) => res.learningPlanGoalProgress
        )
      );
  }
}
