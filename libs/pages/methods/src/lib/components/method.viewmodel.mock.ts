import { Injectable } from '@angular/core';
import { ViewModelInterface } from '@campus/testing';
import { MethodViewModel } from './method.viewmodel';

@Injectable({
  providedIn: 'root'
})
export class MockMethodViewModel
  implements ViewModelInterface<MethodViewModel> {}
