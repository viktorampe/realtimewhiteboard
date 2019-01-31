import { Component, Inject, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import {
  AlertActions,
  AlertQueries,
  AlertReducer,
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  EduContentInterface,
  EffectFeedbackActions,
  EffectFeedbackInterface,
  EffectFeedbackQueries,
  FeedbackServiceInterface,
  FEEDBACK_SERVICE_TOKEN,
  UserActions
} from '@campus/dal';
import { AlertQueueApi, PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { Action, select, Store } from '@ngrx/store';
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

  alert$ = this.store.pipe(
    select(AlertQueries.getAll),
    map(alerts => alerts[0])
  );

  effectFeedback$: Observable<EffectFeedbackInterface> = this.store.pipe(
    select(EffectFeedbackQueries.getNext)
  );

  date: Date = new Date('2019-01-22');

  constructor(
    public loginPageviewModel: LoginPageViewModel,
    private personApi: PersonApi,
    private alertApi: AlertQueueApi,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface,
    private store: Store<AlertReducer.State>,
    private router: Router,
    @Inject(FEEDBACK_SERVICE_TOKEN)
    private snackBarService: FeedbackServiceInterface
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

  setAlertAsRead(alertId: number, displayResponse: boolean) {
    this.store.dispatch(
      new AlertActions.SetReadAlert({
        personId: this.authService.userId,
        alertIds: alertId,
        read: true,
        displayResponse: displayResponse
      })
    );
  }

  setAlertAsUnread(alertId: number, displayResponse: boolean) {
    this.store.dispatch(
      new AlertActions.SetReadAlert({
        personId: this.authService.userId,
        alertIds: alertId,
        read: false,
        displayResponse: displayResponse
      })
    );
  }

  removeFeedback(feedbackId: string) {
    this.store.dispatch(
      new EffectFeedbackActions.DeleteEffectFeedback({ id: feedbackId })
    );
  }

  dispatchAction(action: Action) {
    this.store.dispatch(action);
  }
}
