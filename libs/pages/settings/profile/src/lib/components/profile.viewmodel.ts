import { Inject, Injectable } from '@angular/core';
import {
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  DalState,
  PersonInterface,
  UserActions,
  UserQueries
} from '@campus/dal';
import { EnvironmentUIInterface, ENVIRONMENT_UI_TOKEN } from '@campus/shared';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileViewModel {
  public currentUser$: Observable<PersonInterface>;

  constructor(
    private store: Store<DalState>,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface,
    @Inject(ENVIRONMENT_UI_TOKEN) public environmentUi: EnvironmentUIInterface
  ) {
    this.setPresentationStreams();
  }

  public updateProfile(changedProps: Partial<PersonInterface>): void {
    this.store.dispatch(
      new UserActions.UpdateUser({
        userId: this.authService.userId,
        changedProps
      })
    );
  }

  private setPresentationStreams(): void {
    this.currentUser$ = this.store.pipe(select(UserQueries.getCurrentUser));
  }
}
