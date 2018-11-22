import { inject, TestBed } from '@angular/core/testing';
import { ScormApiService, SCORM_API_SERVICE_TOKEN } from '@campus/scorm';
import { ScormExerciseService } from './scorm-exercise.service';

describe('ScormExerciseService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ScormExerciseService,
        { provide: SCORM_API_SERVICE_TOKEN, useClass: ScormApiService }
      ]
    });
  });

  it('should be created', inject(
    [ScormExerciseService],
    (service: ScormExerciseService) => {
      expect(service).toBeTruthy();
    }
  ));

  it('previewWithAnswers', () => {});
});
