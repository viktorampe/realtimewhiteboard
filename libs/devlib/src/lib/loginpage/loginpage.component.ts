import { Component, Inject, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import {
  AlertReducer,
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  EduContentInterface,
  UserActions
} from '@campus/dal';
import { AlertQueueApi, PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { LoginPageViewModel } from './loginpage.viewmodel';

@Component({
  selector: 'campus-loginpage',
  templateUrl: './loginpage.component.html',
  styleUrls: ['./loginpage.component.css']
})
export class LoginpageComponent implements OnInit {
  educontents: Observable<EduContentInterface[]>;
  currentUser: Observable<any>;
  route$: Observable<string[]>;
  response: Observable<any>;
  constructor(
    public loginPageviewModel: LoginPageViewModel,
    private personApi: PersonApi,
    private alertApi: AlertQueueApi,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface,
    private store: Store<AlertReducer.State>,
    private router: Router
  ) {}

  ngOnInit() {
    this.route$ = this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map((ne: NavigationEnd) => ne.urlAfterRedirects.split('/').slice(2)),
      filter(urlParts => urlParts.length > 0),
      map(urlParts => {
        return urlParts.map(part =>
          isNaN(+part) ? part : `Error statusCode: ${part}`
        );
      })
    );
  }

  getCurrentUser() {
    this.currentUser = this.authService.getCurrent();
  }

  loadCurrentUserinState() {
    this.store.dispatch(new UserActions.LoadUser({ force: true }));
  }

  updateStudentContentStatus() {
    this.loginPageviewModel.updateStudentContentStatus();
  }

  updateAlert() {
    this.loginPageviewModel.updateAlert();
  }

  deleteAlert() {
    // soft-deletes all recieved alerts of the user -> works
    // this.response = this.personApi.deleteAlertQueues(34);

    // soft-deletes all sent alerts of the user -> works
    // this.response = this.personApi.deleteOwnsAlerts(34);

    // soft-deletes a single alert of the user -> works
    // return unauthorised if the alert is already deleted
    this.response = this.personApi.destroyByIdAlertQueues(34, 48);
  }
}
