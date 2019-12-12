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
import {
  EffectFeedback,
  EffectFeedbackActions,
  Priority
} from '../effect-feedback';
import {
  PersonServiceInterface,
  PERSON_SERVICE_TOKEN
} from './../../persons/persons.service';
import {
  fromUserActions,
  LoadPermissions,
  LoadUser,
  LogInUser,
  PermissionsLoadError,
  RemoveUser,
  UpdateUser,
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
        const effectFeedback = new EffectFeedback({
          id: this.uuid(),
          triggerAction: action,
          message: 'De gebruikersnaam of het wachtwoord is niet correct.',
          userActions: [],
          type: 'error',
          priority: Priority.HIGH
        });
        const feedbackAction = new EffectFeedbackActions.AddEffectFeedback({
          effectFeedback
        });
        return feedbackAction;
        //return new UserRemoveError(error);
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
              new EffectFeedbackActions.AddEffectFeedback({
                effectFeedback: new EffectFeedback({
                  id: this.uuid(),
                  triggerAction: action,
                  message: 'Je gegevens zijn opgeslagen.'
                })
              })
            )
          );
      },
      undoAction: (action: UpdateUser, state: DalState) => {
        return from([
          undo(action),
          new EffectFeedbackActions.AddEffectFeedback({
            effectFeedback: new EffectFeedback({
              id: this.uuid(),
              triggerAction: action,
              message: 'Het is niet gelukt om je gegevens te bewaren.',
              type: 'error',
              userActions: [
                {
                  title: 'Opnieuw proberen.',
                  userAction: action
                }
              ],
              priority: Priority.HIGH
            })
          })
        ]);
      }
    }
  );

  /**
   * get permissions from api. errors when call fails.
   *
   * @memberof UserEffects
   */
  @Effect()
  loadPermissions$ = this.dataPersistence.fetch(
    UserActionTypes.LoadPermissions,
    {
      run: (action: LoadPermissions, state: DalState) => {
        if (!action.payload.force && state.user.permissionsLoaded) return;
        return this.authService.getPermissions().pipe(
          map(r => {
            return new fromUserActions.PermissionsLoaded(r);
          })
        );
      },
      onError: (action: LoadPermissions, error) => {
        return new PermissionsLoadError(error);
      }
    }
  );

  constructor(
    private actions$: Actions,
    private dataPersistence: DataPersistence<DalState>,
    @Inject(PERSON_SERVICE_TOKEN) private personService: PersonServiceInterface,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface,
    @Inject('uuid') private uuid: Function
  ) {}
}
