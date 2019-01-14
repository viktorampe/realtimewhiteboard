import { Injectable } from '@angular/core';
import {
  CredentialFixture,
  PassportUserCredentialInterface,
  PersonFixture,
  PersonInterface
} from '@campus/dal';
import { ViewModelInterface } from '@campus/testing';
import { BehaviorSubject } from 'rxjs';
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
      profile: { platform: 'foo.smartschool.be' },
      provider: 'smartschool'
    }),
    new CredentialFixture({
      id: 2,
      profile: { platform: 'foo.smartschool.be' },
      provider: 'smartschool'
    })
  ]);

  public singleSignOnProviders$ = new BehaviorSubject<
    SingleSignOnProviderInterface[]
  >([
    { providerId: 1, description: 'Hoehel' },
    { providerId: 2, description: 'Smoelboek' },
    { providerId: 3, description: 'SmaaaaaartSchool' }
  ]);

  public useProfilePicture(credential: PassportUserCredentialInterface): void {}
  public linkCredential(providerId: number): void {}
  public unlinkCredential(credential: PassportUserCredentialInterface): void {}
}
