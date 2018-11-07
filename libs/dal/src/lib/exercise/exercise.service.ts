import { Injectable } from '@angular/core';
import { ExerciseInterface, ResultInterface } from '@campus/dal';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResultsService } from '../results/results.service';
import { ExerciseServiceInterface } from './exercise.service.interface';

@Injectable({
  providedIn: 'root'
})
export class ExerciseService implements ExerciseServiceInterface {
  public getAllForUser(userId: number): Observable<ExerciseInterface[]> {
    return;
  }

  public startExercise(
    userId: number,
    educontentId: number,
    taskId?: number,
    unlockedContentId?: number
  ): Observable<ExerciseInterface> {
    let result$: Observable<ResultInterface>;
    if (!(taskId || unlockedContentId) || (taskId && unlockedContentId)) {
      throw new Error('Provide either a taskId or an unlockedContentId');
    }

    if (taskId) {
      result$ = this.resultsService.getResultForTask(
        userId,
        taskId,
        educontentId
      );
    } else {
      result$ = this.resultsService.getResultForUnlockedContent(
        userId,
        unlockedContentId,
        educontentId
      );
    }

    let tempUrl$: Observable<any>; //TODO: Type this
    tempUrl$ = this.tempUrlService.getTempUrl();

    const exercise$ = combineLatest(result$, tempUrl$).pipe(
      map(([result, url]) => {}) //TODO: map this to ExerciseInterface
    );

    return exercise$;
  }

  public saveExercise() {}

  constructor(
    private resultsService: ResultsService,
    private tempUrlService: any
  ) {}
}
