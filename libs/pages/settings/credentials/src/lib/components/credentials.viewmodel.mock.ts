import { Injectable } from '@angular/core';
import { PersonFixture, PersonInterface } from '@campus/dal';
import { ViewModelInterface } from '@campus/testing';
import { BehaviorSubject } from 'rxjs';
import { CredentialsViewModel } from './credentials.viewmodel';

@Injectable({
  providedIn: 'root'
})
export class MockCredentialsViewModel
  implements ViewModelInterface<CredentialsViewModel> {
  public currentUser$ = new BehaviorSubject<PersonInterface>(
    new PersonFixture({
      firstName: 'Manon',
      name: 'Bakker',
      username: 'student1',
      email: 'manon.bakker@diekeure.be'
    })
  );
}
