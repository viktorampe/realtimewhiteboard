import { TestBed } from '@angular/core/testing';

import { LearningPlanGoalProgressService } from './learning-plan-goal-progress.service';

describe('LearningPlanGoalProgressService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LearningPlanGoalProgressService = TestBed.get(LearningPlanGoalProgressService);
    expect(service).toBeTruthy();
  });
});
