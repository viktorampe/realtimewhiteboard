import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { map } from 'rxjs/operators';
import { AuthServiceToken } from '../../persons/auth-service';
import { AuthServiceInterface } from '../../persons/auth-service.interface';
import {
  fromUserActions,
  LoadUser,
  RemoveUser,
  UserActionTypes,
  UserLoadError,
  UserRemoveError
} from './user.actions';
import { UserState } from './user.reducer';

@Injectable()
export class UserEffects {
  /**
   * get current from api. errors when no user is logged in.
   *
   * @memberof UserEffects
   */
  @Effect()
  loadUser$ = this.dataPersistence.fetch(UserActionTypes.LoadUser, {
    run: (action: LoadUser, state: UserState) => {
      return this.authService.getCurrent().pipe(
        map(r => {
          return new fromUserActions.UserLoaded(r);
        })
      );
    },
    onError: (action: LoadUser, error) => {
      return new UserLoadError(error);
    }
  });

  /**
   * logsout the current user and remove from store.
   *
   * @memberof UserEffects
   */
  @Effect()
  removedUser$ = this.dataPersistence.fetch(UserActionTypes.RemoveUser, {
    run: (action: RemoveUser, state: UserState) => {
      return this.authService.logout().pipe(
        map(() => {
          return new fromUserActions.UserRemoved({});
        })
      );
    },
    onError: (action: RemoveUser, error) => {
      console.log(action, error);
      return new UserRemoveError(error);
    }
  });

  constructor(
    private actions$: Actions,
    private dataPersistence: DataPersistence<UserState>,
    @Inject(AuthServiceToken) private authService: AuthServiceInterface
  ) {}
}
