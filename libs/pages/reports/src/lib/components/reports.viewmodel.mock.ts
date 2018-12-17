import { Injectable } from '@angular/core';
import {
  EduContentFixture,
  LearningAreaFixture,
  LearningAreaInterface,
  ResultFixture
} from '@campus/dal';
import { ViewModelInterface } from '@campus/testing';
import { ListFormat } from '@campus/ui';
import { BehaviorSubject, Observable } from 'rxjs';
import { ReportsViewModel } from './reports.viewmodel';
import {
  AssignmentResultInterface,
  LearningAreasWithResultsInterface
} from './reports.viewmodel.interfaces';

@Injectable({
  providedIn: 'root'
})
export class MockReportsViewModel
  implements ViewModelInterface<ReportsViewModel> {
  // presentation streams
  listFormat$: Observable<ListFormat> = new BehaviorSubject<ListFormat>(
    ListFormat.GRID
  );

  learningAreasWithResults$: Observable<
    LearningAreasWithResultsInterface
  > = new BehaviorSubject<LearningAreasWithResultsInterface>({
    learningAreas: [
      {
        learningArea: new LearningAreaFixture({ id: 1, name: 'wiskunde' }),
        tasksWithResultsCount: 1,
        bundlesWithResultsCount: 1
      },
      {
        learningArea: new LearningAreaFixture({ id: 2, name: 'frans' }),
        tasksWithResultsCount: 2,
        bundlesWithResultsCount: 3
      }
    ]
  });

  selectedLearningArea$: Observable<
    LearningAreaInterface
  > = new BehaviorSubject<LearningAreaInterface>(
    new LearningAreaFixture({ id: 1 })
  );

  resultsForSelectedLearningArea: Observable<
    AssignmentResultInterface[]
  > = new BehaviorSubject<AssignmentResultInterface[]>([
    {
      title: 'foo',
      type: 'bundle',
      totalScore: 71,
      exerciseResults: [
        {
          eduContent: new EduContentFixture(),
          results: [new ResultFixture({ id: 1 }), new ResultFixture({ id: 2 })],
          bestResult: new ResultFixture({ id: 2 }),
          averageScore: 60
        }
      ]
    },
    {
      title: 'foo',
      type: 'bundle',
      totalScore: 78,
      exerciseResults: [
        {
          eduContent: new EduContentFixture(),
          results: [new ResultFixture({ id: 1 }), new ResultFixture({ id: 2 })],
          bestResult: new ResultFixture({ id: 1 }),
          averageScore: 80
        }
      ]
    }
  ]);

  getLearningAreaById(): Observable<LearningAreaInterface> {
    return;
  }
  getAssignmentResultsByLearningArea(): Observable<
    AssignmentResultInterface[]
  > {
    return;
  }

  openContentForReview() {
    return;
  }
}
