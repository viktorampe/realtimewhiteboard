import { TestBed } from '@angular/core/testing';
import { EduContentFixture, ResultFixture, ResultInterface } from '@campus/dal';
import { Dictionary } from '@ngrx/entity';
import { AssignmentResultInterface } from '../components/reports.viewmodel.interfaces';
import { ReportService } from './report.service';

describe('ReportService', () => {
  let service: ReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(ReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAssignmentResultsByLearningArea', () => {
    let mockResults: ResultInterface[];
    let mockEduContents;
    beforeEach(() => {
      // moved to bottom of file for readability
      mockResults = getMockResults();

      mockEduContents = {
        1: new EduContentFixture({ id: 1 }),
        2: new EduContentFixture({ id: 2 })
      };
    });

    it('should return the correct amount of assignments', () => {
      let resultsDict: Dictionary<ResultInterface[]> = { 1: [mockResults[0]] };
      let returnedAmount = service.getAssignmentResults(
        resultsDict,
        'foo',
        mockEduContents
      ).length;

      expect(returnedAmount).toBe(1);

      resultsDict = {
        1: [mockResults[0], mockResults[1]],
        2: [mockResults[2]]
      };
      returnedAmount = service.getAssignmentResults(
        resultsDict,
        'foo',
        mockEduContents
      ).length;

      expect(returnedAmount).toBe(2);

      resultsDict = {};
      returnedAmount = service.getAssignmentResults(
        resultsDict,
        'foo',
        mockEduContents
      ).length;

      expect(returnedAmount).toBe(0);
    });

    it('should return the correct amount of results', () => {
      let resultsDict: Dictionary<ResultInterface[]> = { 1: [mockResults[0]] };
      let returnedAmount = countResults(
        service.getAssignmentResults(resultsDict, 'foo', mockEduContents)
      );
      expect(returnedAmount).toBe(1);

      resultsDict = {
        1: [mockResults[0], mockResults[1]],
        2: [mockResults[2]]
      };
      returnedAmount = countResults(
        service.getAssignmentResults(resultsDict, 'foo', mockEduContents)
      );
      expect(returnedAmount).toBe(3);

      resultsDict = {};
      returnedAmount = countResults(
        service.getAssignmentResults(resultsDict, 'foo', mockEduContents)
      );
      expect(returnedAmount).toBe(0);
    });

    it('should return the requested Assignments', () => {
      // one result
      let resultsDict: Dictionary<ResultInterface[]> = {
        1: [mockResults[0]]
      };

      let returnedValue = service.getAssignmentResults(
        resultsDict,
        'foo',
        mockEduContents
      );

      let expectedValue = [
        {
          title: mockResults[0].assignment,
          type: 'foo',
          totalScore: mockResults[0].score,
          exerciseResults: [
            {
              results: [mockResults[0]],
              bestResult: mockResults[0],
              averageScore: mockResults[0].score,
              eduContent: mockEduContents[1]
            }
          ]
        }
      ];

      expect(returnedValue).toEqual(expectedValue);

      // 2 results, 1 eduContentId
      resultsDict = {
        1: [mockResults[0], mockResults[2]]
      };

      returnedValue = service.getAssignmentResults(
        resultsDict,
        'foo',
        mockEduContents
      );

      expectedValue = [
        {
          title: mockResults[0].assignment,
          type: 'foo',
          totalScore: mockResults[2].score,
          exerciseResults: [
            {
              results: [mockResults[0], mockResults[2]],
              bestResult: mockResults[2],
              averageScore: (mockResults[0].score + mockResults[2].score) / 2,
              eduContent: mockEduContents[1]
            }
          ]
        }
      ];

      expect(returnedValue).toEqual(expectedValue);

      // 3 results, 2 tasks/bundles, 1 eduContentId per task/bundle
      resultsDict = {
        1: [mockResults[0], mockResults[2]],
        2: [mockResults[1]]
      };

      returnedValue = service.getAssignmentResults(
        resultsDict,
        'foo',
        mockEduContents
      );

      expectedValue = [
        {
          title: mockResults[0].assignment,
          type: 'foo',
          totalScore: mockResults[2].score,
          exerciseResults: [
            {
              eduContent: mockEduContents[1],
              results: [mockResults[0], mockResults[2]],
              bestResult: mockResults[2],
              averageScore: (mockResults[0].score + mockResults[2].score) / 2
            }
          ]
        },
        {
          title: mockResults[1].assignment,
          type: 'foo',
          totalScore: mockResults[1].score,
          exerciseResults: [
            {
              eduContent: mockEduContents[2],
              results: [mockResults[1]],
              bestResult: mockResults[1],
              averageScore: mockResults[1].score
            }
          ]
        }
      ];

      expect(returnedValue).toEqual(expectedValue);

      // 3 results, 1 task/bundle, 2 eduContentId per task/bundle
      resultsDict = {
        1: [mockResults[0], mockResults[1], mockResults[2]]
      };

      returnedValue = service.getAssignmentResults(
        resultsDict,
        'foo',
        mockEduContents
      );

      expectedValue = [
        {
          title: mockResults[0].assignment,
          type: 'foo',
          totalScore: (mockResults[2].score + mockResults[1].score) / 2,
          exerciseResults: [
            {
              eduContent: mockEduContents[1],
              results: [mockResults[0], mockResults[2]],
              bestResult: mockResults[2],
              averageScore: (mockResults[0].score + mockResults[2].score) / 2
            },
            {
              eduContent: mockEduContents[2],
              results: [mockResults[1]],
              bestResult: mockResults[1],
              averageScore: mockResults[1].score
            }
          ]
        }
      ];

      expect(returnedValue).toEqual(expectedValue);
    });
  });
});

function countResults(assignments: AssignmentResultInterface[]): number {
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
      eduContentId: 2, //enigste result met edContentId 2
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
    })
  ];
}
