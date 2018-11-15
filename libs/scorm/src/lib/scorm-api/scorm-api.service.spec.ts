import { inject, TestBed } from '@angular/core/testing';
import { ScormApiService, WINDOW } from './scorm-api.service';

describe('ScormApiService', () => {
  let scormApiService: ScormApiService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ScormApiService, { provide: WINDOW, useValue: {} }]
    });

    scormApiService = TestBed.get(ScormApiService);
  });

  it('should be created', inject(
    [ScormApiService],
    (service: ScormApiService) => {
      expect(service).toBeTruthy();
    }
  ));

  describe('API is present on the window', () => {
    beforeEach(() => {});
    it('should not do anything', () => {});
  });
});
