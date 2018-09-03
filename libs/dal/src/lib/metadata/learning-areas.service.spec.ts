import { TestBed, inject } from '@angular/core/testing';

import { LearningAreasService } from './learning-areas.service';

describe('LearningAreasService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LearningAreasService]
    });
  });

  it('should be created', inject(
    [LearningAreasService],
    (service: LearningAreasService) => {
      expect(service).toBeTruthy();
    }
  ));
});
