import { Injectable } from '@angular/core';
import { EduContent, ResultInterface } from '@campus/dal';
import { groupArrayByKey } from '@campus/utils';
import { Dictionary } from '@ngrx/entity';
import { AssignmentResult } from '../components/reports.viewmodel.interfaces';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  public getAssignmentResults(
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
