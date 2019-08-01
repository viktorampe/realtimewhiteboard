import { inject, TestBed } from '@angular/core/testing';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { hot } from '@nrwl/nx/testing';
import { configureTestSuite } from 'ng-bullet';
import { LearningPlanGoalProgressService } from './learning-plan-goal-progress.service';
import { LearningPlanGoalProgressServiceInterface } from './learning-plan-goal-progress.service.interface';

describe('LearningPlanGoalProgressService', () => {
  let service: LearningPlanGoalProgressServiceInterface;
  let mockData$: any;
  let personApi: PersonApi;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        LearningPlanGoalProgressService,
        {
          provide: PersonApi,
          useValue: {
            getData: () => mockData$
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
        a: { learningPlanGoalProgress: [{ id: 666 }] }
      });
      expect(service.getAllForUser(1)).toBeObservable(
        hot('-a-|', {
          a: [{ id: 666 }]
        })
      );
    });
  });
});
