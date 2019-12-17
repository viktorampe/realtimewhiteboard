import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  DalState,
  EffectFeedbackActions,
  EffectFeedbackInterface,
  EffectFeedbackQueries,
  PersonInterface,
  UserActions,
  UserQueries
} from '@campus/dal';
import {
  EnvironmentLoginInterface,
  ENVIRONMENT_LOGIN_TOKEN
} from '@campus/shared';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, skip, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginViewModel {
  public currentUser$: Observable<PersonInterface>;
  public loginPresets = this.environmentLogin.loginPresets;
  public errorFeedback$: Observable<EffectFeedbackInterface>;

  constructor(
    private store: Store<DalState>,
    @Inject(ENVIRONMENT_LOGIN_TOKEN)
    private environmentLogin: EnvironmentLoginInterface,
    private router: Router
  ) {
    this.setupStreams();
    this.errorFeedback$ = this.store.pipe(
      select(EffectFeedbackQueries.getFeedbackForAction, {
        actionType: UserActions.UserActionTypes.LogInUser
      })
    );
  }

  public login(username: string, password: string) {
    this.redirectAfterLogin();

    this.store.dispatch(
      new UserActions.LogInUser({
        ...this.prepareLogin(username),
        password,
        customFeedbackHandlers: {
          useCustomErrorHandler: true,
          useCustomSuccessHandler: 'useNoHandler'
        }
      })
    );
  }

  public logout() {
    this.store.dispatch(new UserActions.RemoveUser());
  }

  public clearError() {
    this.errorFeedback$.pipe(take(1)).subscribe(error => {
      if (!error) {
        return;
      }
      const deleteFBA = new EffectFeedbackActions.DeleteEffectFeedback({
        id: error.id
      });
      this.store.dispatch(deleteFBA);
    });
  }

  private setupStreams() {
    this.currentUser$ = this.store.pipe(select(UserQueries.getCurrentUser));
  }

  private prepareLogin(emailOrUsername: string) {
    return emailOrUsername.includes('@')
      ? { email: emailOrUsername }
      : { username: emailOrUsername };
  }

  private redirectAfterLogin(route = ['']) {
    this.currentUser$
      .pipe(
        skip(1), // skip value before login
        take(1), // complete after 1 login
        filter(user => !!user) // only redirect when login is succesful
      )
      .subscribe(() => {
        this.router.navigate(route);
      });
  }
}
