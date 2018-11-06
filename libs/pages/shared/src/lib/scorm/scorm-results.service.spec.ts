import { TestBed, inject } from '@angular/core/testing';

import { ScormResultsService } from './scorm-results.service';

describe('ScormResultsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ScormResultsService]
    });
  });

  it('should be created', inject([ScormResultsService], (service: ScormResultsService) => {
    expect(service).toBeTruthy();
  }));
});
