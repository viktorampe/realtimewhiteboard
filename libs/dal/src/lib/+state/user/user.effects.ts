import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { map } from 'rxjs/operators';
import { DalState } from '..';
import {
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN
} from '../../persons/auth-service.interface';
import {
  fromUserActions,
  LoadUser,
  RemoveUser,
  UserActionTypes,
  UserLoadError,
  UserRemoveError
} from './user.actions';

@Injectable()
export class UserEffects {
  /**
   * get current from api. errors when no user is logged in.
   *
   * @memberof UserEffects
   */
  @Effect()
  loadUser$ = this.dataPersistence.fetch(UserActionTypes.LoadUser, {
    run: (action: LoadUser, state: DalState) => {
      if (!action.payload.force && state.user.loaded) return;
      return this.authService
        .login({
          username: action.payload.username,
          password: action.payload.password
        })
        .pipe(
          map(r => {
            return new fromUserActions.UserLoaded(r.user);
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
    run: (action: RemoveUser, state: DalState) => {
      return this.authService.logout().pipe(
        map(() => {
          return new fromUserActions.UserRemoved();
        })
      );
    },
    onError: (action: RemoveUser, error) => {
      return new UserRemoveError(error);
    }
  });

  constructor(
    private actions$: Actions,
    private dataPersistence: DataPersistence<DalState>,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface
  ) {}
}
