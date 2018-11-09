import { Component, OnInit } from '@angular/core';
import {
  AlertReducer,
  EduContentInterface,
  ResultInterface
} from '@campus/dal';
import { ScormCMIMode, ScormResultsService, ScormStatus } from '@campus/shared';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
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
    private personApi: PersonApi,
    private store: Store<AlertReducer.State>,
    private scormResultsService: ScormResultsService
  ) {}

  ngOnInit() {}

  getCurrentUser() {
    this.currentUser = this.personApi.getCurrent();
  }

  loadCurrentUserinState() {
    this.store.dispatch(new LoadUser({ force: true }));
  }

  // tslint:disable-next-line:member-ordering
  resultTask$: Observable<ResultInterface>;
  getResultForTask() {
    const result = this.scormResultsService.getResultForTask(6, 1, 1);
    this.resultTask$ = result;
  }

  // tslint:disable-next-line:member-ordering
  resultUnlockedContent$: Observable<ResultInterface>;
  getResultForUnlockedContent() {
    const result = this.scormResultsService.getResultForUnlockedContent(
      6,
      1,
      1
    );
    this.resultUnlockedContent$ = result;
  }

  // tslint:disable-next-line:member-ordering
  resultSaved$: any;
  saveResult() {
    const result = this.scormResultsService.saveResult(6, 2, this.cmi);

    this.resultSaved$ = result;
  }

  // tslint:disable-next-line:member-ordering
  cmi = {
    mode: ScormCMIMode.CMI_MODE_NORMAL,
    core: {
      score: { raw: 100 },
      lesson_location: '',
      lesson_status: ScormStatus.STATUS_COMPLETED,
      total_time: '0:1:4.76',
      session_time: '0000:00:00'
    }
  };
}
