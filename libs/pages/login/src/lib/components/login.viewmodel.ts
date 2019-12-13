import { Injectable } from '@angular/core';
import {
  DalState,
  EffectFeedbackActions,
  EffectFeedbackInterface,
  EffectFeedbackQueries,
  PersonInterface,
  UserActions,
  UserQueries
} from '@campus/dal';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginViewModel {
  public currentUser$: Observable<PersonInterface>;
  public errorFeedback$: Observable<EffectFeedbackInterface>;

  public loginPresets = [
    { label: 'Student', username: 'student1', password: 'testje' },
    { label: 'Leerkracht', username: 'teacher1', password: 'testje' }
  ];

  constructor(private store: Store<DalState>) {
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
}
