import { Inject, Injectable } from '@angular/core';
import {
  ScormApiServiceInterface,
  SCORM_API_SERVICE_TOKEN
} from '@campus/scorm';
import { ScormExerciseServiceInterface } from './scorm-exercise.service.interface';

@Injectable({
  providedIn: 'root'
})
export class ScormExerciseService implements ScormExerciseServiceInterface {
  constructor(
    @Inject(SCORM_API_SERVICE_TOKEN) private scormApi: ScormApiServiceInterface
  ) {}

  previewWithAnswers(): any {}

  previewWithoutAnswers(): any {}

  task(): any {}

  training(): any {}

  review(): any {}
}
