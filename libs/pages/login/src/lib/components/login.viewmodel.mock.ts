import { Injectable } from '@angular/core';
import { PersonFixture, PersonInterface } from '@campus/dal';
import { ViewModelInterface } from '@campus/testing';
import { BehaviorSubject } from 'rxjs';
import { LoginViewModel } from './login.viewmodel';

@Injectable({
  providedIn: 'root'
})
export class MockLoginViewModel implements ViewModelInterface<LoginViewModel> {
  public currentUser$ = new BehaviorSubject<PersonInterface>(
    new PersonFixture()
  );

  public loginPresets = [
    { label: 'Student', username: 'student1', password: 'testje' },
    { label: 'Leerkracht', username: 'teacher1', password: 'testje' }
  ];

  public login(username: string, password: string) {}
  public logout() {}
}
