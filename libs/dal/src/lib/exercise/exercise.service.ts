import { Injectable } from '@angular/core';
import { ResultInterface } from '@campus/dal';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CurrentExerciseInterface } from '../+state/current-exercise/current-exercise.reducer';
import { ExerciseServiceInterface } from './exercise.service.interface';

// TODO: remove vvv and fix imports

@Injectable({
  providedIn: 'root'
})
export class TempUrlService {
  public getTempUrl(): Observable<string> {
    return;
  }
}

@Injectable({
  providedIn: 'root'
})
export class ResultsService {
  public getResultForTask(
    userId: number,
    taskId: number,
    educontentId: number
  ): Observable<ResultInterface> {
    return;
  }
  public getResultForUnlockedContent(
    userId: number,
    unlockedContentId: number,
    educontentId: number
  ): Observable<ResultInterface> {
    return;
  }

  public saveResult(
    userId: number,
    cmi: any
  ): Observable<CurrentExerciseInterface> {
    return;
  }
}

export enum ScormCMIMode {
  CMI_MODE_NORMAL = 'normal',
  CMI_MODE_BROWSE = 'browse',
  CMI_MODE_REVIEW = 'review',
  CMI_MODE_PREVIEW = 'preview'
}

// end remove ^^^

@Injectable({
  providedIn: 'root'
})
export class ExerciseService implements ExerciseServiceInterface {
  public startExercise(
    userId: number,
    educontentId: number,
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
    tempUrl$ = this.tempUrlService.getTempUrl();

    const exercise$ = combineLatest(result$, tempUrl$).pipe(
      map(([result, url]) => {
        return {
          eduContent: result.eduContent,
          cmiMode: result.cmi.mode,
          result: result,
          saveToApi: true, //afhankelijk van cmi.mode
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

    const result$ = this.resultsService.saveResult(userId, cmi);

    return result$;
  }

  constructor(
    private resultsService: ResultsService,
    private tempUrlService: TempUrlService
  ) {}
}
