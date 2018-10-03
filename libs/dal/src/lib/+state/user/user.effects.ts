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
  @Effect()
  removedUser$ = this.dataPersistence.fetch(UserActionTypes.RemoveUser, {
    run: (action: RemoveUser, state: UserState) => {
      return this.authService.logout().pipe(
        map(d => {
          console.log('remove user effect', d);
          return new fromUserActions.UserRemoved(d);
        })
      );
    },
    onError: (action: RemoveUser, error) => {
      return new UserRemoveError(error);
    }
  });

  constructor(
    private actions$: Actions,
    private dataPersistence: DataPersistence<UserState>,
    @Inject(AuthServiceToken) private authService: AuthServiceInterface
  ) {}
}
