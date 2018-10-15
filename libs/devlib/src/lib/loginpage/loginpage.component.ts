import { Component, OnInit } from '@angular/core';
import {
  EduContentInterface,
  StudentContentStatusActions,
  StudentContentStatusQueries
} from '@campus/dal';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { StudentContentStatusInterface } from './../../../../dal/src/lib/+models/StudentContentStatus.interface';
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
    private loginPageviewModel: LoginPageViewModel,
    private personApi: PersonApi
  ) {}

  ngOnInit() {}

  getCurrentUser() {
    this.currentUser = this.personApi.getCurrent();
  }

  // tslint:disable-next-line:member-ordering
  response3$: any;
  getStudentContentStatusFromStoreById(id: number) {
    this.response3$ = this.loginPageviewModel.studentContentStatusStore.pipe(
      select(StudentContentStatusQueries.getById, { id: id })
    );
  }

  setStudentContentStatusInStore(
    id: number,
    status: StudentContentStatusInterface
  ) {
    this.loginPageviewModel.studentContentStatusStore.dispatch(
      new StudentContentStatusActions.UpdateStudentContentStatus()
    );
  }
}
