import { Injectable } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { ScormCmiMode } from '../+external-interfaces/scorm-api.interface';
import { ResultInterface } from '../+models';
import { ResultsService } from '../results/results.service';
import { CurrentExerciseInterface } from './../+state/current-exercise/current-exercise.reducer';
import { ContentRequestService } from './../content-request/content-request.service';
import { ExerciseServiceInterface } from './exercise.service.interface';

@Injectable({
  providedIn: 'root'
})
export class ExerciseService implements ExerciseServiceInterface {
  public loadExercise(
    userId: number,
    educontentId: number,
    saveToApi: boolean,
    mode: ScormCmiMode,
    taskId?: number,
    unlockedContentId?: number,
    result?: ResultInterface,
    unlockedFreePracticeId?: number
  ): Observable<CurrentExerciseInterface> {
    if (result) {
      return this.reviewExercise(result);
    }

    if (!saveToApi) {
      // if no saves to api + not review => preview!
      return this.previewExercise(educontentId, mode);
    }

    return this.startExercise(
      userId,
      educontentId,
      saveToApi,
      mode,
      taskId,
      unlockedContentId,
      unlockedFreePracticeId
    );
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

  private reviewExercise(
    result: ResultInterface
  ): Observable<CurrentExerciseInterface> {
    let tempUrl$: Observable<string>;
    tempUrl$ = this.contentRequestService.requestUrl(result.eduContentId);

    const exercise$ = tempUrl$.pipe(
      map(url => {
        return {
          eduContentId: result.eduContentId,
          cmiMode: ScormCmiMode.CMI_MODE_REVIEW,
          result: result,
          saveToApi: false,
          url: url
        } as CurrentExerciseInterface;
      })
    );

    return exercise$;
  }

  private previewExercise(
    eduContentId: number,
    mode: ScormCmiMode
  ): Observable<CurrentExerciseInterface> {
    let tempUrl$: Observable<string>;
    tempUrl$ = this.contentRequestService.requestUrl(eduContentId);

    const exercise$ = tempUrl$.pipe(
      take(1),
      map(url => {
        return {
          eduContentId: eduContentId,
          cmiMode: mode,
          saveToApi: false,
          url: url
        } as CurrentExerciseInterface;
      })
    );

    return exercise$;
  }

  private startExercise(
    userId: number,
    educontentId: number,
    saveToApi: boolean,
    mode: ScormCmiMode,
    taskId?: number,
    unlockedContentId?: number,
    unlockedFreePracticeId?: number
  ): Observable<CurrentExerciseInterface> {
    let result$: Observable<ResultInterface>;

    const params = [taskId, unlockedContentId, unlockedFreePracticeId];
    if (params.filter(Number).length !== 1) {
      throw new Error(
        'Provide either a taskId, an unlockedContentId or an unlockedFreePracticeId'
      );
    }

    if (taskId) {
      result$ = this.resultsService.getResultForTask(
        userId,
        taskId,
        educontentId
      );
    } else if (unlockedContentId) {
      result$ = this.resultsService.getResultForUnlockedContent(
        userId,
        unlockedContentId,
        educontentId
      );
    } else if (unlockedFreePracticeId) {
      result$ = this.resultsService.getResultForUnlockedFreePractice(
        userId,
        unlockedFreePracticeId,
        educontentId
      );
    }

    let tempUrl$: Observable<string>;
    tempUrl$ = this.contentRequestService.requestUrl(educontentId);

    const exercise$ = combineLatest([result$, tempUrl$]).pipe(
      take(1),
      map(([resultFromApi, url]) => {
        return {
          eduContentId: resultFromApi.eduContentId,
          cmiMode: mode,
          result: resultFromApi,
          saveToApi: saveToApi,
          url: url
        } as CurrentExerciseInterface;
      })
    );

    return exercise$;
  }

  constructor(
    private resultsService: ResultsService,
    private contentRequestService: ContentRequestService
  ) {}
}
