import { TestBed, inject } from '@angular/core/testing';

import { ScormApiService } from './scorm-api.service';

describe('ScormApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ScormApiService]
    });
  });

  it('should be created', inject([ScormApiService], (service: ScormApiService) => {
    expect(service).toBeTruthy();
  }));
});
