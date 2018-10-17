import { Component, OnInit } from '@angular/core';
import {
  EduContentInterface,
  StudentContentStatusActions,
  StudentContentStatusInterface,
  StudentContentStatusQueries
} from '@campus/dal';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { Update } from '@ngrx/entity';
import { select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { LoginPageViewModel } from './loginpage.viewmodel';

@Component({
  selector: 'campus-loginpage',
  templateUrl: './loginpage.component.html',
  styleUrls: ['./loginpage.component.css']
})
export class LoginpageComponent implements OnInit {
  educontents: Observable<EduContentInterface[]>;
  currentUser: Observable<any>;
  constructor(
    public loginPageviewModel: LoginPageViewModel,
    private personApi: PersonApi
  ) {}

  ngOnInit() {}

  getCurrentUser() {
    this.currentUser = this.personApi.getCurrent();
  }

  // tslint:disable-next-line:member-ordering
  response3$: any;
  getStudentContentStatusFromStoreById(id: number) {
    const res$ = this.loginPageviewModel.studentContentStatusStore.pipe(
      select(StudentContentStatusQueries.getById, { id: id })
    );

    this.response3$ = res$;
    return res$;
  }

  saveStudentContentStatus(
    studentContentStatus: StudentContentStatusInterface
  ) {
    const updatedStudentContentStatus: Update<StudentContentStatusInterface> = {
      id: studentContentStatus.id,
      changes: {
        contentStatusId: studentContentStatus.contentStatusId
      }
    };

    const oldStudentContentStatus = this.getStudentContentStatusFromStoreById(
      studentContentStatus.id
    );

    oldStudentContentStatus.pipe(take(1)).subscribe(oldValue =>
      this.loginPageviewModel.studentContentStatusStore.dispatch(
        new StudentContentStatusActions.UpdateStudentContentStatus({
          studentContentStatus: updatedStudentContentStatus
        })
      )
    );
  }
}
