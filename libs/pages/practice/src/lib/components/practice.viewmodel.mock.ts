import { Injectable } from '@angular/core';
import { ViewModelInterface } from '@campus/testing';
import { PracticeViewModel } from './practice.viewmodel';

@Injectable({
  providedIn: 'root'
})
export class MockPracticeViewModel
  implements ViewModelInterface<PracticeViewModel> {
  constructor() {}
}
