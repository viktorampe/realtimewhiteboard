import { Injectable } from '@angular/core';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
    return this.personApi['getLearningPlanGoalsForBookRemote'](
      userId,
      bookId
    ).pipe(map(response => response['result'])); //TODO don't avoid typescript
  }

  constructor(private personApi: PersonApi) {}
}
