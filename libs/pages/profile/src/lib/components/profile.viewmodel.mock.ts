import { Injectable } from '@angular/core';
import { PersonInterface } from '@campus/dal';
import { ViewModelInterface } from '@campus/testing';
import { BehaviorSubject } from 'rxjs';
import { ProfileViewModel } from './profile.viewmodel';

@Injectable({
  providedIn: 'root'
})
export class MockProfileViewModel
  implements ViewModelInterface<ProfileViewModel> {
  constructor() {}

  public currentUser$ = new BehaviorSubject<Partial<PersonInterface>>({
    firstName: 'Manon',
    name: 'Bakker',
    username: 'student1',
    email: 'manon.bakker@diekeure.be'
  });
}
