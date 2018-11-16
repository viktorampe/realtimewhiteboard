import { Injectable } from '@angular/core';
import { ScormExerciseServiceInterface } from './scorm-exercise.service.interface';

@Injectable({
  providedIn: 'root'
})
export class ScormExerciseService implements ScormExerciseServiceInterface {
  constructor() {}

  previewWithAnswers(): any {}

  previewWithoutAnswers(): any {}

  task(): any {}

  training(): any {}

  review(): any {}
}
