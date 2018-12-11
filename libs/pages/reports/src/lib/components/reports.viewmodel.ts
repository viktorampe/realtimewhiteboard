import { Injectable } from '@angular/core';
import {
  AuthService,
  DalState,
  EduContent,
  EduContentQueries,
  LearningAreaInterface,
  LearningAreaQueries,
  ResultInterface,
  ResultQueries
} from '@campus/dal';
import { MemoizedSelectorWithProps, select, Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  AssignmentResult,
  LearningAreasWithResultsInterface
} from './reports.viewmodel.interfaces';

@Injectable({
  providedIn: 'root'
})
export class ReportsViewModel {
  // source streams
  learningAreas$: Observable<LearningAreaInterface[]>;

  // presentation streams
  learningAreasWithResults$: Observable<LearningAreasWithResultsInterface>;

  constructor(
    private store: Store<DalState>,
    private authService: AuthService
  ) {
    this.setSourceStreams();
    this.setPresentationStreams();
  }

  public getLearningAreaById(
    areaId: number
  ): Observable<LearningAreaInterface> {
    return this.select(LearningAreaQueries.getById, { id: areaId });
  }

  public getAssignmentResultsByLearningArea(
    learningAreaId: number
  ): Observable<AssignmentResult[]> {
    const userId = this.authService.userId;

    const output = combineLatest(
      this.select(EduContentQueries.getAllEntities) as Observable<EduContent[]>,
      this.select(ResultQueries.getByLearningAreaIdGroupedByTaskId, {
        learningAreaId
      }),
      this.select(ResultQueries.getByLearningAreaIdGroupedByTaskId, {
        learningAreaId
      })
    ).pipe(
      map(([eduContents, resultsByTaskId, resultsByUnlockedContentId]) => {
        const taskAssigmentResults = Object.keys(resultsByTaskId).map(
          taskId =>
            ({
              title: resultsByTaskId[taskId][0].title,
              type: 'task',
              ...this.getExerciseResults(resultsByTaskId[taskId], eduContents)
            } as AssignmentResult)
        );

        const unlockedContentAssigmentResults = Object.keys(
          resultsByUnlockedContentId
        ).map(
          contentId =>
            ({
              title: resultsByUnlockedContentId[contentId][0].title,
              type: 'task',
              ...this.getExerciseResults(
                resultsByUnlockedContentId[contentId],
                eduContents
              )
            } as AssignmentResult)
        );

        return [...taskAssigmentResults, ...unlockedContentAssigmentResults];
      })
    );

    return output;
  }

  private getExerciseResults(
    results: ResultInterface[],
    eduContents: EduContent[]
  ): {} {
    const resultsPerEduContentId = results
      .reduce(
        (acc, result) => {
          const group = acc[result.eduContentId];
          if (group) {
            group.results.push(result);
            group.resultCount++;
            if (result.score > group.resultMaxScore) {
              group.resultMaxScore = result.score;
              group.resultMax = result;
            }
            group.resultTotalScore += result.score;
          } else {
            acc[result.eduContentId] = {
              eduContentId: result.eduContentId,
              results: [result],
              resultCount: 1,
              resultMaxScore: result.score,
              resultMax: result,
              resultTotalScore: result.score
            };
          }

          return acc;
        },
        [] as ExerciseResultsReducerInterface[]
      )
      .filter(arrayValue => arrayValue) // indexen met lege waardes verwijderen
      .map(reducedEducontent => ({
        eduContent: eduContents.find(
          eduC => eduC.id === reducedEducontent.eduContentId
        ),
        results: reducedEducontent.results,
        bestResult: reducedEducontent.resultMax,
        averageScore:
          reducedEducontent.resultTotalScore / reducedEducontent.resultCount
      }));

    const totalScoreAllEduContents = resultsPerEduContentId.reduce(
      (sum, eduC) => (sum += eduC.bestResult.score),
      0
    );
    const averageScoreAllEduContents =
      totalScoreAllEduContents / resultsPerEduContentId.length;

    return {
      totalScore: averageScoreAllEduContents,
      exerciseResults: resultsPerEduContentId
    };
  }

  private setSourceStreams() {
    this.learningAreas$ = this.select(LearningAreaQueries.getAll);
  }

  private setPresentationStreams() {}

  private select<T, Props>(
    selector: MemoizedSelectorWithProps<DalState, Props, T>,
    payload?: Props
  ): Observable<T> {
    return this.store.pipe(select(selector, payload));
  }
}

interface ExerciseResultsReducerInterface {
  eduContentId: number;
  results: ResultInterface[];
  resultCount: number;
  resultMaxScore: number;
  resultMax: ResultInterface;
  resultTotalScore: number;
}
