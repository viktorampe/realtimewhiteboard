import { Injectable } from '@angular/core';
import { ViewModelInterface } from '@campus/testing';
import { BehaviorSubject } from 'rxjs';
import { ProfileViewModel, UserProfileInterface } from './profile.viewmodel';

@Injectable({
  providedIn: 'root'
})
export class MockProfileViewModel
  implements ViewModelInterface<ProfileViewModel> {
  constructor() {}

  public currentUserProfile$ = new BehaviorSubject<UserProfileInterface>({
    firstName: 'Manon',
    lastName: 'Bakker',
    username: 'student1',
    email: 'manon.bakker@diekeure.be'
  });
}
