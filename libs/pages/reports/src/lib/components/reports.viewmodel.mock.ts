import { Injectable } from '@angular/core';
import {
  EduContentFixture,
  LearningAreaFixture,
  LearningAreaInterface,
  ResultFixture
} from '@campus/dal';
import { ListFormat } from '@campus/ui';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  AssignmentResultInterface,
  LearningAreasWithResultsInterface
} from './reports.viewmodel.interfaces';

@Injectable({
  providedIn: 'root'
})
// TODO when viewmodel is done: implements ViewModelInterface<ReportsViewModel>
export class MockReportsViewModel {
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
    new LearningAreaFixture({ id: 1, name: 'Wiskunde', icon: 'polpo-wiskunde' })
  );

  resultsForSelectedLearningArea$: Observable<
    AssignmentResultInterface[]
  > = new BehaviorSubject<AssignmentResultInterface[]>([
    {
      title: 'foo 1',
      type: 'task',
      totalScore: 87.5,
      exerciseResults: [
        {
          eduContent: new EduContentFixture(),
          results: [
            new ResultFixture({ id: 1, score: 45 }),
            new ResultFixture({ id: 2 })
          ],
          bestResult: new ResultFixture({ id: 2 }),
          averageScore: 60
        },
        {
          eduContent: new EduContentFixture(
            {},
            {
              title:
                'really long title to check proper wrapping in the template'
            }
          ),
          results: [new ResultFixture({ id: 3, score: 100 })],
          bestResult: new ResultFixture({ id: 3, score: 100 }),
          averageScore: 100
        }
      ]
    },
    {
      title: 'foo 2',
      type: 'bundle',
      totalScore: 75,
      exerciseResults: [
        {
          eduContent: new EduContentFixture(),
          results: [new ResultFixture({ id: 1 }), new ResultFixture({ id: 2 })],
          bestResult: new ResultFixture({ id: 1 }),
          averageScore: 75
        }
      ]
    }
  ]);

  getLearningAreaById(): Observable<LearningAreaInterface> {
    return this.selectedLearningArea$;
  }

  getAssignmentResultsByLearningArea(): Observable<
    AssignmentResultInterface[]
  > {
    return this.resultsForSelectedLearningArea$;
  }

  openContentForReview(): void {}
}
