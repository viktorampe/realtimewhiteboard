import { Inject, Injectable } from '@angular/core';
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
import { take } from 'rxjs/operators';

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
    private environmentLogin: EnvironmentLoginInterface
  ) {
    this.setupStreams();
    this.errorFeedback$ = this.store.pipe(
      select(EffectFeedbackQueries.getFeedbackForAction, {
        actionType: UserActions.UserActionTypes.LogInUser
      })
    );
  }

  public login(username: string, password: string) {
    this.store.dispatch(
      new UserActions.LogInUser({
        username,
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
}
