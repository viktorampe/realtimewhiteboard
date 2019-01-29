import { Injectable } from '@angular/core';
import {
  CredentialFixture,
  PassportUserCredentialInterface,
  PersonFixture,
  PersonInterface
} from '@campus/dal';
import { ViewModelInterface } from '@campus/testing';
import { BehaviorSubject, Observable, of } from 'rxjs';
import {
  CredentialsViewModel,
  SingleSignOnProviderInterface
} from './credentials.viewmodel';

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
    new CredentialFixture({
      id: 1,
      provider: 'smartschool'
    }),
    new CredentialFixture({
      id: 2,
      provider: 'smartschool'
    })
  ]);

  public singleSignOnProviders$ = new BehaviorSubject<
    SingleSignOnProviderInterface[]
  >([
    { name: 'google', description: 'Hoehel', linkUrl: '' },
    { name: 'facebook', description: 'Smoelboek', linkUrl: '' },
    {
      name: 'smartschool',
      description: 'SmaaaaaartSchool',
      linkUrl: '',
      maxNumberAllowed: 3
    }
  ]);

  public getErrorMessageFromCode(code): Observable<string> {
    return of('whatever');
  }

  public useProfilePicture(credential: PassportUserCredentialInterface): void {}
  public linkCredential(provider: SingleSignOnProviderInterface): void {}
  public unlinkCredential(credential: PassportUserCredentialInterface): void {}
}
