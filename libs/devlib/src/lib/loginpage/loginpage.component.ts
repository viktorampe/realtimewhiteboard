import { Component, OnInit } from '@angular/core';
import {
  AlertActions,
  AlertQueries,
  AlertReducer,
  EduContentInterface
} from '@campus/dal';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { select, Store } from '@ngrx/store';
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
    private loginPageviewModel: LoginPageViewModel,
    private personApi: PersonApi,
    private store: Store<AlertReducer.State>
  ) {}

  ngOnInit() {}

  getCurrentUser() {
    this.currentUser = this.personApi.getCurrent();
  }

  dispatchLoadAction() {
    this.store.dispatch(new AlertActions.LoadAlerts({ userId: 6 }));
  }

  dispatchLoadNewAction() {
    this.store.dispatch(
      new AlertActions.LoadNewAlerts({
        userId: 6,
        timeStamp: new Date(2018, 8, 4)
      })
    );
  }

  dispatchSetAsReadAction() {
    this.store.dispatch(
      new AlertActions.SetReadAlert({
        personId: 6,
        alertIds: [25, 4681],
        read: false
      })
    );
  }

  // tslint:disable-next-line:member-ordering
  response1$: Observable<any>;
  getUnreadAlerts() {
    this.response1$ = this.store.pipe(select(AlertQueries.getUnread));
  }

  // tslint:disable-next-line:member-ordering
  response2$: Observable<any>;
  getRecentAlerts() {
    this.response2$ = this.store.pipe(
      select(AlertQueries.getRecentByDate, {
        timeThreshold: new Date(2018, 9 - 1, 4, 16, 27, 15)
      })
    );
  }
}
