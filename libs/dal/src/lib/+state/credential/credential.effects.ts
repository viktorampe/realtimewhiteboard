import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { DataPersistence } from '@nrwl/angular';
import { undo } from 'ngrx-undo';
import { from } from 'rxjs';
import { map, mapTo, mergeMapTo } from 'rxjs/operators';
import { DalActions, DalState } from '..';
import {
  CredentialServiceInterface,
  CREDENTIAL_SERVICE_TOKEN
} from '../../persons';
import {
  EffectFeedback,
  EffectFeedbackActions,
  Priority
} from '../effect-feedback';
import { LoadUser } from './../user/user.actions';
import {
  CredentialsActionTypes,
  CredentialsLoaded,
  CredentialsLoadError,
  LoadCredentials,
  UnlinkCredential,
  UseCredentialProfilePicture
} from './credential.actions';

@Injectable()
export class CredentialEffects {
  @Effect()
  loadCredentials$ = this.dataPersistence.fetch(
    CredentialsActionTypes.LoadCredentials,
    {
      run: (action: LoadCredentials, state: DalState) => {
        if (!action.payload.force && state.credentials.loaded) return;
        return this.credentialService
          .getAllForUser(action.payload.userId)
          .pipe(map(credentials => new CredentialsLoaded({ credentials })));
      },
      onError: (action: LoadCredentials, error) => {
        return new CredentialsLoadError(error);
      }
    }
  );

  @Effect()
  unlinkCredential$ = this.dataPersistence.optimisticUpdate(
    CredentialsActionTypes.UnlinkCredential,
    {
      run: (action: UnlinkCredential, state: DalState) => {
        return this.credentialService
          .unlinkCredential(action.payload.credential)
          .pipe(
            mapTo(
              new DalActions.ActionSuccessful({
                successfulAction: 'Credential unlinked.'
              })
            )
          );
      },
      undoAction: (action: UnlinkCredential, error) => {
        return undo(action);
      }
    }
  );

  @Effect()
  useCredentialProfilePicture$ = this.dataPersistence.pessimisticUpdate(
    CredentialsActionTypes.UseCredentialProfilePicture,
    {
      run: (action: UseCredentialProfilePicture, state: DalState) => {
        return this.credentialService
          .useCredentialProfilePicture(action.payload.credential)
          .pipe(
            mergeMapTo(
              from<Action[]>([
                new LoadUser({ force: true }),
                new EffectFeedbackActions.AddEffectFeedback({
                  effectFeedback: new EffectFeedback({
                    id: this.uuid(),
                    triggerAction: action,
                    message: 'Je profielfoto is gewijzigd.'
                  })
                })
              ])
            )
          );
      },
      onError: (action: UseCredentialProfilePicture, error) => {
        return new EffectFeedbackActions.AddEffectFeedback({
          effectFeedback: new EffectFeedback({
            id: this.uuid(),
            triggerAction: action,
            message: 'Het is niet gelukt om je profielfoto te wijzigen.',
            type: 'error',
            userActions: [
              {
                title: 'Opnieuw proberen.',
                userAction: action
              }
            ],
            priority: Priority.HIGH
          })
        });
      }
    }
  );

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<DalState>,
    @Inject(CREDENTIAL_SERVICE_TOKEN)
    private credentialService: CredentialServiceInterface,
    @Inject('uuid') private uuid: Function
  ) {}
}
