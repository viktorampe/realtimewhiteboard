import { Injectable } from '@angular/core';
import {
  LinkedPersonActions,
  PersonFixture,
  PersonInterface,
  TeacherStudentActions
} from '@campus/dal';
import { ViewModelInterface } from '@campus/testing';
import { BehaviorSubject } from 'rxjs';
import {
  ActionResponse,
  ApiValidationErrors,
  CoupledTeachersViewModel
} from './coupled-teachers.viewmodel';

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
    new PersonFixture({
      displayName: 'Teacher One',
      teacherInfo: { publicKey: 'adsfss' }
    }),
    new PersonFixture({
      displayName: 'Teacher Two',
      teacherInfo: { publicKey: 'adsf' }
    })
  ]);

  public apiErrors$ = new BehaviorSubject<ApiValidationErrors>({
    nonExistingTeacherCode: 'Deze code is niet geldig ...'
  });

  public successMessages$ = new BehaviorSubject<ActionResponse>({
    action: LinkedPersonActions.LinkedPersonsActionTypes.AddLinkedPerson,
    message: 'Person was successfully linked',
    type: 'success'
  });

  public linkPersonSuccess$ = new BehaviorSubject<ActionResponse>(
    this.makeActionResponse(
      TeacherStudentActions.TeacherStudentActionTypes.LinkTeacherStudent,
      'Person successfully linked',
      'success'
    )
  );
  public linkPersonError$ = new BehaviorSubject<ActionResponse>(
    this.makeActionResponse(
      TeacherStudentActions.TeacherStudentActionTypes.LinkTeacherStudent,
      'Person failed to link',
      'error'
    )
  );
  public unlinkPersonSuccess$ = new BehaviorSubject<ActionResponse>(
    this.makeActionResponse(
      TeacherStudentActions.TeacherStudentActionTypes.UnlinkTeacherStudent,
      'Person successfully unlinked',
      'success'
    )
  );
  public unlinkPersonError$ = new BehaviorSubject<ActionResponse>(
    this.makeActionResponse(
      TeacherStudentActions.TeacherStudentActionTypes.UnlinkTeacherStudent,
      'Person failed to unlink',
      'error'
    )
  );

  linkPerson(publicKey: string): void {}

  unlinkPerson(id: number): void {}

  private makeActionResponse(
    action: string,
    message: string,
    type: 'error' | 'success'
  ): ActionResponse {
    return {
      action: action,
      message: message,
      type: type
    };
  }
}
