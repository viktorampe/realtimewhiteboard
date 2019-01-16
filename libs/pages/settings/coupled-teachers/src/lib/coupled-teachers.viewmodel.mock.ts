import { Injectable } from '@angular/core';
import { PersonFixture, PersonInterface } from '@campus/dal';
import { ViewModelInterface } from '@campus/testing';
import { LinkedPersonsActionTypes } from 'libs/dal/src/lib/+state/linked-person/linked-person.actions';
import { BehaviorSubject } from 'rxjs';
import {
  ActionResponse,
  ApiValidationErrors,
  ProfileViewModel
} from './coupled-teachers.viewmodel';

@Injectable({
  providedIn: 'root'
})
export class MockCoupledTeachersViewModel
  implements ViewModelInterface<ProfileViewModel> {
  public currentUser$ = new BehaviorSubject<PersonInterface>(
    new PersonFixture({
      firstName: 'Foo',
      name: 'Bar',
      username: 'FooBar',
      email: 'foo.bar@mock.com'
    })
  );

  public linkedPersons$ = new BehaviorSubject<PersonInterface[]>([
    new PersonFixture({ displayName: 'Teacher One' }),
    new PersonFixture({ displayName: 'Teacher Two' })
  ]);

  public apiErrors$ = new BehaviorSubject<ApiValidationErrors>({
    nonExistingTeacherCode: 'Deze code is niet geldig ...'
  });

  public successMessages$ = new BehaviorSubject<ActionResponse>({
    action: LinkedPersonsActionTypes.AddLinkedPerson,
    message: 'Person was successfully linked',
    type: 'success'
  });

  linkPerson() {}

  unlinkPerson() {}

  showSuccessToast() {}
}
