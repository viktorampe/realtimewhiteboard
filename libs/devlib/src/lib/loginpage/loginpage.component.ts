import { Component, OnInit } from '@angular/core';
import { AlertReducer, EduContentInterface } from '@campus/dal';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { LoadUser } from './../../../../dal/src/lib/+state/user/user.actions';
import { ScormResultsService } from './../../../../pages/shared/src/lib/scorm/scorm-results.service';
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
  resultTask$: any;
  getResultForTask() {
    const result = this.scormResultsService.getResultForTask(6, 1, 1);
    this.resultTask$ = result;
  }
}
