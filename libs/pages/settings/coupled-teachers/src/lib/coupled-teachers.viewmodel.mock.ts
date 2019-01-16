import { Injectable } from '@angular/core';
import {
  LinkedPersonActions,
  PersonFixture,
  PersonInterface
} from '@campus/dal';
import { ViewModelInterface } from '@campus/testing';
import { BehaviorSubject, of } from 'rxjs';
import {
  ActionResponse,
  ApiValidationErrors,
  CoupledTeachersViewModel
} from './coupled-teachers.viewmodel';

export const ResponseQueries = {
  get: ({  }: any) => {
    return of(<ActionResponse>{
      action: 'mockAction',
      message: 'mockMessage',
      type: 'success'
    });
  }
};
@Injectable({
  providedIn: 'root'
})
export class MockCoupledTeachersViewModel
  implements ViewModelInterface<CoupledTeachersViewModel> {
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
    action: LinkedPersonActions.LinkedPersonsActionTypes.AddLinkedPerson,
    message: 'Person was successfully linked',
    type: 'success'
  });

  linkPerson(publicKey: string): void {}

  unlinkPerson(id: number): void {}
}
