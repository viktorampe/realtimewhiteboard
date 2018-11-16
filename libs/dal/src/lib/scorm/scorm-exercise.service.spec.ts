import { inject, TestBed } from '@angular/core/testing';
import { ScormExerciseService } from './scorm-exercise.service';

describe('ScormExerciseService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ScormExerciseService]
    });
  });

  it('should be created', inject(
    [ScormExerciseService],
    (service: ScormExerciseService) => {
      expect(service).toBeTruthy();
    }
  ));
});
