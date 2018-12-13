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
import { groupArrayByKey } from '@campus/utils';
import { Dictionary } from '@ngrx/entity';
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
    return combineLatest(
      this.select(EduContentQueries.getAllEntities) as Observable<
        Dictionary<EduContent>
      >,
      this.select(ResultQueries.getAssignmentsForLearningAreaId, {
        learningAreaId,
        groupProp: { taskId: 0 }
      }),
      this.select(ResultQueries.getAssignmentsForLearningAreaId, {
        learningAreaId,
        groupProp: { bundleId: 0 }
      })
    ).pipe(
      map(([eduContents, resultsByTaskId, resultsByBundleId]) => {
        return [
          ...this.getAssignmentResults(resultsByTaskId, 'task', eduContents),
          ...this.getAssignmentResults(resultsByBundleId, 'bundle', eduContents)
        ];
      })
    );
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

  private getAssignmentResults(
    resultsById: Dictionary<ResultInterface[]>,
    type: string,
    eduContents: Dictionary<EduContent>
  ): AssignmentResult[] {
    return Object.keys(resultsById).map(gId => ({
      title: resultsById[gId][0].assignment,
      type: type,
      ...this.getExerciseResults(resultsById[gId], eduContents)
    }));
  }

  private getExerciseResults(
    results: ResultInterface[],
    eduContents: Dictionary<EduContent>
  ) {
    const resultsByEduContentId = groupArrayByKey<ResultInterface>(results, {
      eduContentId: 0
    });

    const exerciseResults = Object.keys(resultsByEduContentId).map(
      eduContentId => {
        const eduContentResults = resultsByEduContentId[eduContentId];

        let bestResult = eduContentResults[0],
          totalScore = 0;

        eduContentResults.forEach(result => {
          if (result.score > bestResult.score) {
            bestResult = result;
          }
          totalScore += result.score;
        });

        return {
          eduContentId: +eduContentId,
          eduContent: eduContents[eduContentId],
          results: eduContentResults,
          bestResult: bestResult,
          averageScore: totalScore / eduContentResults.length
        };
      }
    );

    const totalScoreAllEduContents = exerciseResults.reduce(
      (sum, value) => (sum += value.bestResult.score),
      0
    );

    const averageScoreAllEduContents =
      totalScoreAllEduContents / exerciseResults.length;

    return {
      totalScore: averageScoreAllEduContents,
      exerciseResults: exerciseResults
    };
  }
}
