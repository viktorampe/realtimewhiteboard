import { inject, TestBed } from '@angular/core/testing';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { cold } from '@nrwl/nx/testing';
import { configureTestSuite } from 'ng-bullet';
import { of } from 'rxjs';
import { LearningPlanGoalServiceInterface } from '.';
import { LearningPlanGoalFixture } from '../+fixtures';
import { LearningPlanGoalService } from './learning-plan-goal.service';

describe('LearningPlanGoalService', () => {
  let service: LearningPlanGoalServiceInterface;
  let personApi: PersonApi;

  const userId = 1;
  const bookId = 1;
  const mockLearningPlanGoal = new LearningPlanGoalFixture({
    id: 42
  });

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        LearningPlanGoalService,
        {
          provide: PersonApi,
          useValue: {
            getLearningPlanGoalsForBookRemote: () => {}
          }
        }
      ]
    });
  });

  beforeEach(() => {
    service = TestBed.get(LearningPlanGoalService);
    personApi = TestBed.get(PersonApi);
  });

  it('should be created and available via DI', inject(
    [LearningPlanGoalService],
    (learningPlanGoalService: LearningPlanGoalService) => {
      expect(learningPlanGoalService).toBeTruthy();
    }
  ));

  describe('getLearningPlanGoalsForBook', () => {
    it('should return LearningPlanGoals', () => {
      // TODO don't avoid typescript
      personApi[
        'getLearningPlanGoalsForBookRemote'
      ] = jest.fn().mockReturnValue(of([mockLearningPlanGoal]));

      const response = service.getLearningPlanGoalsForBook(userId, bookId);

      expect(
        personApi['getLearningPlanGoalsForBookRemote']
      ).toHaveBeenCalledWith(userId, bookId);

      expect(response).toBeObservable(cold('a', { a: [mockLearningPlanGoal] }));
    });
  });
});
