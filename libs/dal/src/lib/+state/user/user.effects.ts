import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { map } from 'rxjs/operators';
import { AuthServiceToken } from '../../persons/auth-service';
import { AuthServiceInterface } from '../../persons/auth-service.interface';
import {
  fromUserActions,
  LoadUser,
  UserActionTypes,
  UserLoadError
} from './user.actions';
import { UserState } from './user.reducer';

@Injectable()
export class UserEffects {
  @Effect()
  loadUser$ = this.dataPersistence.fetch(UserActionTypes.LoadUser, {
    run: (action: LoadUser, state: UserState) => {
      console.log('running action', LoadUser);
      return this.authService.getCurrent().pipe(
        map(r => {
          console.log('effect', r);
          return new fromUserActions.UserLoaded(r);
        })
      );
    },
    onError: (action: LoadUser, error) => {
      console.log('effect error', error);
      return new UserLoadError(error);
    }
  });

  constructor(
    private actions$: Actions,
    private dataPersistence: DataPersistence<UserState>,
    @Inject(AuthServiceToken) private authService: AuthServiceInterface
  ) {}
}
