import { Component, OnInit } from '@angular/core';
import { AlertQueueInterface, EduContentInterface } from '@campus/dal';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { AlertService } from 'libs/dal/src/lib/alert/alert.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
    private alertService: AlertService
  ) {}

  ngOnInit() {}

  getCurrentUser() {
    this.currentUser = this.personApi.getCurrent();
  }

  // tslint:disable-next-line:member-ordering
  response1$: Observable<AlertQueueInterface[]>;
  getAllAlerts() {
    this.response1$ = this.alertService.getAllAlertsForCurrentUser(6);
  }

  // tslint:disable-next-line:member-ordering
  response2$: Observable<AlertQueueInterface[]>;
  getAllAlertsSinceDate() {
    this.response2$ = this.alertService.getAlertsForCurrentUserByDate(
      6,
      new Date(2018, 8, 1)
    );
  }

  // tslint:disable-next-line:member-ordering
  response3$: Observable<AlertQueueInterface>;
  setAlertRead() {
    const alert = <AlertQueueInterface>(
      this.alertService
        .getAllAlertsForCurrentUser(6)
        .pipe(map(arr => arr.filter(a => !a.read)))[0]
    );

    this.response3$ = this.alertService.setAlertAsRead(alert);
  }

  setAlertUnRead() {}
}
