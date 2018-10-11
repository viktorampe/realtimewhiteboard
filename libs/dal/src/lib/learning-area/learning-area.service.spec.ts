import { inject, TestBed } from '@angular/core/testing';
import { LearningAreaApi } from '@diekeure/polpo-api-angular-sdk';
import { LearningAreaService } from './learning-area.service';

export class MockLearningAreaApi {}

describe('LearningAreaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LearningAreaService,
        { provide: LearningAreaApi, useClass: MockLearningAreaApi }
      ]
    });
  });

  it('should be created', inject(
    [LearningAreaService],
    (service: LearningAreaService) => {
      expect(service).toBeTruthy();
    }
  ));
});
