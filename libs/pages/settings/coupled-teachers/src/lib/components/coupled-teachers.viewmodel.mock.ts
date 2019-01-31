import { Injectable } from '@angular/core';
import { PersonFixture, PersonInterface } from '@campus/dal';
import { ViewModelInterface } from '@campus/testing';
import { BehaviorSubject } from 'rxjs';
import { CoupledTeachersViewModel } from './coupled-teachers.viewmodel';
import { ApiValidationErrors } from './coupled-teachers/coupled-teachers.component';

@Injectable({
  providedIn: 'root'
})
export class MockCoupledTeachersViewModel
  implements ViewModelInterface<CoupledTeachersViewModel> {
  public mockLinkedPersons = [
    new PersonFixture({
      displayName: 'Teacher One',
      teacherInfo: { publicKey: 'foo-key-1' },
      linkedAt: new Date('1')
    }),
    new PersonFixture({
      displayName: 'Teacher Two',
      teacherInfo: { publicKey: 'foo-key-2' },
      linkedAt: new Date('1')
    })
  ];
  public currentUser$ = new BehaviorSubject<PersonInterface>(
    new PersonFixture({
      firstName: 'Foo',
      name: 'Bar',
      username: 'FooBar',
      email: 'foo.bar@mock.com'
    })
  );

  public linkedPersons$ = new BehaviorSubject<PersonInterface[]>(
    this.mockLinkedPersons
  );

  public apiErrors$ = new BehaviorSubject<ApiValidationErrors>({
    nonExistingTeacherCode: true
  });

  linkPerson(publicKey: string): void {}

  unlinkPerson(id: number): void {}
}
