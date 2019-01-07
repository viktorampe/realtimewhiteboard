import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { undo } from 'ngrx-undo';
import { from } from 'rxjs';
import { map, mapTo } from 'rxjs/operators';
import { DalState } from '..';
import {
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN
} from '../../persons/auth-service.interface';
import { PersonService } from './../../persons/persons.service';
import {
  fromUserActions,
  LoadUser,
  LogInUser,
  RemoveUser,
  UpdateUser,
  UserActionTypes,
  UserLoadError,
  UserRemoveError,
  UserUpdateMessage
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
   * logs a user in.
   *
   * @memberof UserEffects
   */
  @Effect()
  loginUser$ = this.dataPersistence.pessimisticUpdate(
    UserActionTypes.LogInUser,
    {
      run: (action: LogInUser, state: DalState) => {
        return this.authService.login(action.payload).pipe(
          map(() => {
            return new fromUserActions.LoadUser({ force: false });
          })
        );
      },
      onError: (action: LogInUser, error) => {
        return new UserRemoveError(error);
      }
    }
  );

  /**
   * logsout the current user and remove from store.
   *
   * @memberof UserEffects
   */
  @Effect()
  removedUser$ = this.dataPersistence.pessimisticUpdate(
    UserActionTypes.RemoveUser,
    {
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
    }
  );

  @Effect()
  updateUser$ = this.dataPersistence.optimisticUpdate(
    UserActionTypes.UpdateUser,
    {
      run: (action: UpdateUser, state: DalState) => {
        return this.personService
          .updateUser(action.payload.userId, action.payload.changedProps)
          .pipe(
            mapTo(
              new UserUpdateMessage({
                message: 'User updated',
                timeStamp: new Date().getTime()
              })
            )
          );
      },
      undoAction: (action: UpdateUser, state: DalState) => {
        return from([
          undo(action),
          new UserUpdateMessage({
            message: 'User update failed',
            timeStamp: new Date().getTime()
          })
        ]);
      }
    }
  );

  constructor(
    private actions$: Actions,
    private dataPersistence: DataPersistence<DalState>,
    private personService: PersonService,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface
  ) {}
}
