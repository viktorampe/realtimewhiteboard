import { Injectable } from '@angular/core';
import { ResultInterface } from '@campus/dal';
import { ScormCmiMode } from '@campus/scorm';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
      map(([result, url]) => {
        if (result.cmi === null) {
          result.cmi = {
            mode: ScormCmiMode.CMI_MODE_NORMAL
          };
        }

        return {
          eduContent: result.eduContent,
          cmiMode: result.cmi.mode,
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
    const resultId = exercise.result.id;
    const cmi = exercise.result.cmi;

    const result$ = this.resultsService.saveResult(userId, resultId, cmi).pipe(
      map(result => {
        return {
          ...exercise,
          eduContent: result.eduContent,
          cmiMode: result.cmi.mode,
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
