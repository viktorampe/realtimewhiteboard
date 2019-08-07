import { Injectable } from '@angular/core';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { Observable } from 'rxjs';
import { LearningPlanGoalServiceInterface } from '.';
import { LearningPlanGoalInterface } from '../+models';

@Injectable({
  providedIn: 'root'
})
export class LearningPlanGoalService
  implements LearningPlanGoalServiceInterface {
  getLearningPlanGoalsForBook(
    userId: number,
    bookId: number
  ): Observable<LearningPlanGoalInterface[]> {
    return this.personApi.getLearningPlanGoalsForBookRemote(userId, bookId);
  }

  constructor(private personApi: PersonApi) {}
}
