import { inject, TestBed } from '@angular/core/testing';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { cold, hot } from '@nrwl/nx/testing';
import { configureTestSuite } from 'ng-bullet';
import { of } from 'rxjs';
import { LearningPlanGoalProgressFixture } from '../+fixtures';
import {
  MinimalLearningPlanGoalProgressEduContentTocInterface,
  MinimalLearningPlanGoalProgressUserLessonInterface
} from '../+state/learning-plan-goal-progress/learning-plan-goal-progress.actions';
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
            createLearningPlanGoalProgress: () => {},
            destroyManyLearningPlanGoalProgress: () => of('useful'),
            createLearningPlanGoalProgresses: () => of([{ stuff: 'is good' }])
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

  describe('createLearningPlanGoalProgress for EduContentTOC', () => {
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
    const mockUserLessonId = undefined;
    const mockEduContentBookId = 2202397597;
    const mockLearningPlanGoalIds = [789, 147];

    it('should call the api and return the results', () => {
      personApi.createLearningPlanGoalProgress = jest
        .fn()
        .mockReturnValue(of(mockLearningPlanGoalProgressArray));

      const response = service.createLearningPlanGoalProgress(
        userId,
        mockClassGroupId,
        mockLearningPlanGoalIds,
        mockEduContentBookId,
        mockUserLessonId,
        mockEduContentTOCId
      );

      expect(personApi.createLearningPlanGoalProgress).toHaveBeenCalledWith(
        userId,
        mockClassGroupId,
        mockLearningPlanGoalIds,
        null,
        mockEduContentTOCId,
        mockEduContentBookId
      );

      expect(response).toBeObservable(
        cold('(a|)', { a: mockLearningPlanGoalProgressArray })
      );
    });
  });
  describe('createLearningPlanGoalProgress for UserLesson', () => {
    const mockLearningPlanGoalProgressArray = [
      new LearningPlanGoalProgressFixture({
        id: 42
      }),
      new LearningPlanGoalProgressFixture({
        id: 43
      })
    ];

    const mockClassGroupId = 123;
    const mockEduContentTOCId = undefined;
    const mockUserLessonId = 456;
    const mockEduContentBookId = 1618928396;
    const mockLearningPlanGoalIds = [789, 147];

    it('should call the api and return the results', () => {
      personApi.createLearningPlanGoalProgress = jest
        .fn()
        .mockReturnValue(of(mockLearningPlanGoalProgressArray));

      const response = service.createLearningPlanGoalProgress(
        userId,
        mockClassGroupId,
        mockLearningPlanGoalIds,
        mockEduContentBookId,
        mockUserLessonId,
        mockEduContentTOCId
      );

      expect(personApi.createLearningPlanGoalProgress).toHaveBeenCalledWith(
        userId,
        mockClassGroupId,
        mockLearningPlanGoalIds,
        mockUserLessonId,
        null,
        mockEduContentBookId
      );

      expect(response).toBeObservable(
        cold('(a|)', { a: mockLearningPlanGoalProgressArray })
      );
    });
  });

  describe('deleteLearningPlanGoalProgresses', () => {
    it('should call the personApi destroyManyLearningPlanGoalProgress method with the correct parameters', () => {
      const spy = jest.spyOn(personApi, 'destroyManyLearningPlanGoalProgress');

      const id = 16;
      const lpgpsIds = [94, 64, 46];
      expect(
        service.deleteLearningPlanGoalProgresses(id, lpgpsIds)
      ).toBeObservable(hot('(a|)', { a: true }));
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(id, lpgpsIds);
    });
  });
  describe('createLearningPlanGoalProgresses', () => {
    it('should call the personApi createLearningPlanGoalProgresses method with the correct parameters', () => {
      const spy = jest.spyOn(personApi, 'createLearningPlanGoalProgresses');

      const id = 16;
      const progresses: (
        | MinimalLearningPlanGoalProgressEduContentTocInterface
        | MinimalLearningPlanGoalProgressUserLessonInterface)[] = [
        {
          classGroupId: 10,
          learningPlanGoalId: 37,
          eduContentTocId: 17,
          eduContentBookId: 24
        },
        {
          classGroupId: 3,
          learningPlanGoalId: 75,
          userLessonId: 37,
          eduContentBookId: 20
        },
        {
          classGroupId: 71,
          learningPlanGoalId: 37,
          eduContentTocId: 32,
          eduContentBookId: 74
        },
        {
          classGroupId: 12,
          learningPlanGoalId: 73,
          userLessonId: 65,
          eduContentBookId: 96
        }
      ];
      expect(
        service.createLearningPlanGoalProgresses(id, progresses)
      ).toBeObservable(hot('(a|)', { a: [{ stuff: 'is good' }] }));
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(id, progresses);
    });
  });
});
