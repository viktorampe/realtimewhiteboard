import { TestBed } from '@angular/core/testing';

import { LearningPlanService } from './learning-plan.service';

describe('LearningPlanService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LearningPlanService = TestBed.get(LearningPlanService);
    expect(service).toBeTruthy();
  });
});
