import { Injectable } from '@angular/core';
import {
  PassportUserCredentialInterface,
  PersonFixture,
  PersonInterface
} from '@campus/dal';
import { ViewModelInterface } from '@campus/testing';
import { BehaviorSubject } from 'rxjs';
import { Url } from 'url';
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

  public credentials$ = new BehaviorSubject<PassportUserCredentialInterface[]>([
    {
      id: 1,
      profile: { platform: 'foo.smartschool.be' },
      provider: 'smartschool'
    }
  ]); //TODO use fixture, created in credential service branch

  public singleSignOnLinks$ = new BehaviorSubject<Url[]>([]);

  public updateProfile(
    userId: number,
    changedProps: Partial<PersonInterface>
  ): void {}

  public unlinkCredential(userId: number, credentialId: number): void {}
}
