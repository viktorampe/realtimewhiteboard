import { inject, TestBed } from '@angular/core/testing';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { cold, hot } from '@nrwl/nx/testing';
import { configureTestSuite } from 'ng-bullet';
import { of } from 'rxjs';
import { LearningPlanGoalProgressFixture } from '../+fixtures';
import { LearningPlanGoalProgressService } from './learning-plan-goal-progress.service';
import { LearningPlanGoalProgressServiceInterface } from './learning-plan-goal-progress.service.interface';

describe('LearningPlanGoalProgressService', () => {
  let service: LearningPlanGoalProgressServiceInterface;
  let mockData$: any;
  let personApi: PersonApi;

  const userId = 1;
  const mockLearningPlanGoalProgress = new LearningPlanGoalProgressFixture({
    id: 42
  });

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        LearningPlanGoalProgressService,
        {
          provide: PersonApi,
          useValue: {
            getData: () => mockData$,
            destroyByIdLearningPlanProgress: () => {},
            bulkCreateLearningPlanGoalProgressForTOC: () => {},
            createLearningPlanGoalProgressForUserLesson: () => {}
          }
        }
      ]
    });
  });

  beforeEach(() => {
    service = TestBed.get(LearningPlanGoalProgressService);
    personApi = TestBed.get(PersonApi);
  });

  it('should be created and available via DI', inject(
    [LearningPlanGoalProgressService],
    (learningPlanGoalProgressService: LearningPlanGoalProgressService) => {
      expect(learningPlanGoalProgressService).toBeTruthy();
    }
  ));

  describe('getAllForUser', () => {
    it('should return learningPlanGoalProgress', async () => {
      mockData$ = hot('-a-|', {
        a: { learningPlanGoalProgress: [mockLearningPlanGoalProgress] }
      });
      expect(service.getAllForUser(userId)).toBeObservable(
        hot('-a-|', {
          a: [mockLearningPlanGoalProgress]
        })
      );
    });
  });

  describe('deleteLearningPlanGoalProgress', () => {
    it('should call the api and return true', () => {
      personApi.destroyByIdLearningPlanProgress = jest
        .fn()
        .mockReturnValue(of(null));

      const response = service.deleteLearningPlanGoalProgress(
        userId,
        mockLearningPlanGoalProgress.id
      );

      expect(personApi.destroyByIdLearningPlanProgress).toHaveBeenCalledWith(
        userId,
        mockLearningPlanGoalProgress.id
      );

      expect(response).toBeObservable(cold('(a|)', { a: true }));
    });
  });

  describe('bulkCreateLearningPlanGoalProgress', () => {
    const mockLearningPlanGoalProgressArray = [
      new LearningPlanGoalProgressFixture({
        id: 42
      }),
      new LearningPlanGoalProgressFixture({
        id: 43
      })
    ];

    const mockClassGroupId = 123;
    const mockEduContentTOCId = 456;
    const mockLearningPlanGoalIds = [789, 147];

    it('should call the api and return the results', () => {
      //TODO don't avoid type checking -> after publish
      personApi[
        'bulkCreateLearningPlanGoalProgressForTOC'
      ] = jest.fn().mockReturnValue(of(mockLearningPlanGoalProgressArray));

      const response = service.bulkCreateLearningPlanGoalProgress(
        userId,
        mockClassGroupId,
        mockEduContentTOCId,
        mockLearningPlanGoalIds
      );

      //TODO don't avoid type checking -> after publish
      expect(
        personApi['bulkCreateLearningPlanGoalProgressForTOC']
      ).toHaveBeenCalledWith(
        userId,
        mockClassGroupId,
        mockEduContentTOCId,
        mockLearningPlanGoalIds
      );

      expect(response).toBeObservable(
        cold('(a|)', { a: mockLearningPlanGoalProgressArray })
      );
    });
  });

  describe('createLearningPlanGoalProgressForUserLesson', () => {
    const mockClassGroupId = 123;
    const mockUserLessonId = 456;
    const mockLearningPlanGoalId = 789;

    it('should call the api and return the results', () => {
      //TODO don't avoid type checking -> after publish
      personApi[
        'createLearningPlanGoalProgressForUserLesson'
      ] = jest.fn().mockReturnValue(of(mockLearningPlanGoalProgress));

      const response = service.createLearningPlanGoalProgressForUserLesson(
        userId,
        mockClassGroupId,
        mockUserLessonId,
        mockLearningPlanGoalId
      );

      //TODO don't avoid type checking -> after publish
      expect(
        personApi['createLearningPlanGoalProgressForUserLesson']
      ).toHaveBeenCalledWith(
        userId,
        mockClassGroupId,
        mockUserLessonId,
        mockLearningPlanGoalId
      );

      expect(response).toBeObservable(
        cold('(a|)', { a: mockLearningPlanGoalProgress })
      );
    });
  });
});
