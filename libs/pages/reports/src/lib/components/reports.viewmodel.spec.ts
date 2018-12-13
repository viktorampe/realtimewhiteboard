import { TestBed } from '@angular/core/testing';
import {
  AUTH_SERVICE_TOKEN,
  DalState,
  EduContentActions,
  EduContentFixture,
  EduContentReducer,
  getStoreModuleForFeatures,
  LearningAreaActions,
  LearningAreaFixture,
  LearningAreaReducer,
  ResultActions,
  ResultFixture,
  ResultInterface,
  ResultReducer
} from '@campus/dal';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { Store, StoreModule } from '@ngrx/store';
import { hot } from 'jasmine-marbles';
import { map } from 'rxjs/operators';
import { ReportsViewModel } from './reports.viewmodel';
import { AssignmentResult } from './reports.viewmodel.interfaces';

let reportsViewModel: ReportsViewModel;
let store: Store<DalState>;

describe('ReportsViewModel', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        ...getStoreModuleForFeatures([
          LearningAreaReducer,
          EduContentReducer,
          ResultReducer
        ])
      ],
      providers: [
        ReportsViewModel,
        { provide: AUTH_SERVICE_TOKEN, useValue: { userId: 1 } },
        { provide: PersonApi, useValue: {} },
        Store
      ]
    });
    reportsViewModel = TestBed.get(ReportsViewModel);
    store = TestBed.get(Store);
  });

  describe('creation', () => {
    it('should be defined', () => {
      expect(reportsViewModel).toBeDefined();
    });
  });

  describe('presentation streams', () => {
    describe('getLearningAreaById', () => {
      const mockLearningAreas = [
        new LearningAreaFixture({ id: 1 }),
        new LearningAreaFixture({ id: 2 })
      ];
      beforeEach(() => {
        store.dispatch(
          new LearningAreaActions.LearningAreasLoaded({
            learningAreas: mockLearningAreas
          })
        );
      });

      it('should return the requested LearningArea', () => {
        const returnedValue = reportsViewModel.getLearningAreaById(2);

        expect(returnedValue).toBeObservable(
          hot('a', { a: mockLearningAreas[1] })
        );
      });
    });

    describe('getAssignmentResultsByLearningArea', () => {
      // moved to bottom of file for readability
      const mockResults = getMockResults();

      const mockEduContents = [
        new EduContentFixture({ id: 1 }),
        new EduContentFixture({ id: 2 })
      ];

      beforeEach(() => {
        store.dispatch(
          new ResultActions.ResultsLoaded({
            results: mockResults
          })
        );
        store.dispatch(
          new EduContentActions.EduContentsLoaded({
            eduContents: mockEduContents
          })
        );
      });

      it('should return the correct amount of assignments', () => {
        let returnedAmount = reportsViewModel
          .getAssignmentResultsByLearningArea(1)
          .pipe(map(assignments => assignments.length));

        expect(returnedAmount).toBeObservable(hot('a', { a: 4 }));

        returnedAmount = reportsViewModel
          .getAssignmentResultsByLearningArea(2)
          .pipe(map(assignments => assignments.length));

        expect(returnedAmount).toBeObservable(hot('a', { a: 2 }));

        returnedAmount = reportsViewModel
          .getAssignmentResultsByLearningArea(3)
          .pipe(map(assignments => assignments.length));

        expect(returnedAmount).toBeObservable(hot('a', { a: 0 }));
      });

      it('should return the correct amount of results', () => {
        let returnedAmount = reportsViewModel
          .getAssignmentResultsByLearningArea(1)
          .pipe(map(assignments => countResults(assignments)));

        let expectedAmount = mockResults.filter(res => res.learningAreaId === 1)
          .length;
        expect(returnedAmount).toBeObservable(hot('a', { a: expectedAmount }));

        returnedAmount = reportsViewModel
          .getAssignmentResultsByLearningArea(2)
          .pipe(map(assignments => countResults(assignments)));

        expectedAmount = mockResults.filter(res => res.learningAreaId === 2)
          .length;
        expect(returnedAmount).toBeObservable(hot('a', { a: expectedAmount }));

        returnedAmount = reportsViewModel
          .getAssignmentResultsByLearningArea(3)
          .pipe(map(assignments => countResults(assignments)));

        expectedAmount = mockResults.filter(res => res.learningAreaId === 3)
          .length;
        expect(returnedAmount).toBeObservable(hot('a', { a: expectedAmount }));
      });

      it('should return the requested Assignments', () => {
        const returnedValue = reportsViewModel.getAssignmentResultsByLearningArea(
          1
        );

        const expectedValue = [
          {
            title: mockResults[5].assignment,
            type: 'task',
            totalScore: (mockResults[5].score + mockResults[6].score) / 2,
            exerciseResults: [
              {
                eduContentId: 1,
                results: [mockResults[5], mockResults[9]],
                bestResult: mockResults[5],
                averageScore: (mockResults[5].score + mockResults[9].score) / 2,
                eduContent: mockEduContents[0]
              },
              {
                eduContentId: 2,
                results: [mockResults[6]],
                bestResult: mockResults[6],
                averageScore: mockResults[6].score,
                eduContent: mockEduContents[1]
              }
            ]
          },
          {
            title: 'bar task',
            type: 'task',
            totalScore: mockResults[7].score,
            exerciseResults: [
              {
                eduContentId: 1,
                results: [mockResults[7]],
                bestResult: mockResults[7],
                averageScore: mockResults[7].score,
                eduContent: mockEduContents[0]
              }
            ]
          },
          {
            title: mockResults[0].assignment,
            type: 'bundle',
            totalScore: (mockResults[4].score + mockResults[1].score) / 2,
            exerciseResults: [
              {
                eduContentId: 1,
                results: [mockResults[0], mockResults[4]],
                bestResult: mockResults[4],
                averageScore: (mockResults[0].score + mockResults[4].score) / 2,
                eduContent: mockEduContents[0]
              },
              {
                eduContentId: 2,
                results: [mockResults[1]],
                bestResult: mockResults[1],
                averageScore: mockResults[1].score,
                eduContent: mockEduContents[1]
              }
            ]
          },
          {
            title: mockResults[2].assignment,
            type: 'bundle',
            totalScore: mockResults[2].score,
            exerciseResults: [
              {
                eduContentId: 1,
                results: [mockResults[2]],
                bestResult: mockResults[2],
                averageScore: mockResults[2].score,
                eduContent: mockEduContents[0]
              }
            ]
          }
        ];

        expect(returnedValue).toBeObservable(hot('a', { a: expectedValue }));
      });
    });
  });
});

function countResults(assignments: AssignmentResult[]): number {
  return assignments.reduce(
    (total, ass) =>
      (total += ass.exerciseResults.reduce(
        (subTotal, exResult) => (subTotal += exResult.results.length),
        0
      )),
    0
  );
}

function getMockResults(): ResultInterface[] {
  return [
    new ResultFixture({
      id: 1,
      learningAreaId: 1,
      bundleId: 1,
      taskId: null,
      score: 10,
      eduContentId: 1,
      assignment: 'foo bundle'
    }),
    new ResultFixture({
      id: 2,
      learningAreaId: 1,
      bundleId: 1,
      taskId: null,
      score: 50,
      eduContentId: 2,
      assignment: 'foo bundle'
    }),
    new ResultFixture({
      id: 3,
      learningAreaId: 1,
      bundleId: 2,
      taskId: null,
      score: 100,
      eduContentId: 1,
      assignment: 'bar bundle'
    }),
    new ResultFixture({
      id: 4,
      learningAreaId: 2,
      bundleId: 1,
      taskId: null,
      score: 75,
      eduContentId: 1,
      assignment: 'foo bundle'
    }),
    new ResultFixture({
      id: 5,
      learningAreaId: 1,
      bundleId: 1,
      taskId: null,
      score: 90,
      eduContentId: 1,
      assignment: 'foo bundle'
    }),
    new ResultFixture({
      id: 6,
      learningAreaId: 1,
      taskId: 1,
      bundleId: null,
      score: 10,
      eduContentId: 1,
      assignment: 'foo task'
    }),
    new ResultFixture({
      id: 7,
      learningAreaId: 1,
      taskId: 1,
      bundleId: null,
      score: 50,
      eduContentId: 2,
      assignment: 'foo task'
    }),
    new ResultFixture({
      id: 8,
      learningAreaId: 1,
      taskId: 2,
      bundleId: null,
      score: 100,
      eduContentId: 1,
      assignment: 'bar task'
    }),
    new ResultFixture({
      id: 9,
      learningAreaId: 2,
      taskId: 1,
      bundleId: null,
      score: 75,
      eduContentId: 1,
      assignment: 'foo task'
    }),
    new ResultFixture({
      id: 10,
      learningAreaId: 1,
      unlockedContentId: 1,
      taskId: 1,
      bundleId: null,
      score: 0,
      eduContentId: 1,
      assignment: 'foo bar task'
    })
  ];
}
