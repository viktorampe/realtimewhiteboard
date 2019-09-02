import { Injectable } from '@angular/core';
import { ViewModelInterface } from '@campus/testing';
import { TrainingViewModel } from './training.viewmodel';

@Injectable({
  providedIn: 'root'
})
export class MockTrainingViewModel
  implements ViewModelInterface<TrainingViewModel> {
  constructor() {}
}
