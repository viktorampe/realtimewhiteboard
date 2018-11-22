import { TestBed } from '@angular/core/testing';
import { ScormApiService, SCORM_API_SERVICE_TOKEN } from '@campus/scorm';
import { ScormExerciseService } from './scorm-exercise.service';

describe('ScormExerciseService', () => {
  let scormExerciseService: ScormExerciseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ScormExerciseService,
        { provide: SCORM_API_SERVICE_TOKEN, useClass: ScormApiService }
      ]
    });

    scormExerciseService = TestBed.get(ScormExerciseService);
  });

  it('should be created', () => {
    expect(scormExerciseService).toBeTruthy();
  });

  it('should start an preview exercise', () => {});
});
