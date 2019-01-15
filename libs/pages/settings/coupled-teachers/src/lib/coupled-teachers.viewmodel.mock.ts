import { Injectable } from '@angular/core';
import { ViewModelInterface } from '@campus/testing';
import { ProfileViewModel } from './coupled-teachers.viewmodel';

@Injectable({
  providedIn: 'root'
})
export class MockCoupledTeachersViewModel
  implements ViewModelInterface<ProfileViewModel> {
  constructor() {}
}
