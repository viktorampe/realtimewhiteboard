import { Injectable } from '@angular/core';
import { ScormCmiMode } from '@campus/scorm';
import { combineLatest, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { ResultInterface } from '../+models';
import { ResultsService } from '../results/results.service';
import { CurrentExerciseInterface } from './../+state/current-exercise/current-exercise.reducer';
import { ContentRequestService } from './../content-request/content-request.service';
import { ExerciseServiceInterface } from './exercise.service.interface';

@Injectable({
  providedIn: 'root'
})
export class ExerciseService implements ExerciseServiceInterface {
  public startExercise(
    userId: number,
    educontentId: number,
    saveToApi: boolean,
    mode: ScormCmiMode,
    taskId?: number,
    unlockedContentId?: number
  ): Observable<CurrentExerciseInterface> {
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

    let tempUrl$: Observable<string>;
    tempUrl$ = this.contentRequestService.requestUrl(educontentId);

    const exercise$ = combineLatest(result$, tempUrl$).pipe(
      take(1),
      map(([result, url]) => {
        return {
          eduContentId: result.eduContentId,
          cmiMode: mode,
          result: result,
          saveToApi: saveToApi,
          url: url
        } as CurrentExerciseInterface;
      })
    );

    return exercise$;
  }

  public saveExercise(
    exercise: CurrentExerciseInterface
  ): Observable<CurrentExerciseInterface> {
    const userId = exercise.result.personId;
    const result$ = this.resultsService
      .saveResult(userId, exercise.result)
      .pipe(
        map(result => {
          return {
            ...exercise,
            result: result
          } as CurrentExerciseInterface;
        })
      );

    return result$;
  }

  constructor(
    private resultsService: ResultsService,
    private contentRequestService: ContentRequestService
  ) {}
}
