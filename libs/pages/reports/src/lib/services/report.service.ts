import { Injectable } from '@angular/core';
import { EduContent, ResultInterface } from '@campus/dal';
import { groupArrayByKey } from '@campus/utils';
import { Dictionary } from '@ngrx/entity';
import { AssignmentResultInterface } from './../components/reports.viewmodel.interfaces';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  public getAssignmentResults(
    resultsById: Dictionary<ResultInterface[]>,
    type: string,
    eduContents: Dictionary<EduContent>
  ): AssignmentResultInterface[] {
    return Object.values(resultsById).map(groupedResults =>
      this.getAssignmentResultForGroup(groupedResults, type, eduContents)
    );
  }

  private getAssignmentResultForGroup(
    results: ResultInterface[],
    type: string,
    eduContents: Dictionary<EduContent>
  ): AssignmentResultInterface {
    const exerciseResults = this.getExerciseResults(results, eduContents);

    const totalScoreAllEduContents = exerciseResults.reduce(
      (sum, value) => (sum += value.bestResult.score),
      0
    );

    const averageScoreAllEduContents =
      totalScoreAllEduContents / exerciseResults.length;

    return {
      title: results[0].assignment,
      type: type,
      totalScore: averageScoreAllEduContents,
      exerciseResults: exerciseResults
    };
  }

  private getExerciseResults(
    results: ResultInterface[],
    eduContents: Dictionary<EduContent>
  ) {
    const resultsByEduContentId: Dictionary<ResultInterface[]> = groupArrayByKey(
      results,
      'eduContentId'
    );

    return Object.keys(resultsByEduContentId).map(eduContentId => {
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
        eduContent: eduContents[eduContentId],
        results: eduContentResults,
        bestResult: bestResult,
        averageScore: totalScore / eduContentResults.length
      };
    });
  }
}
