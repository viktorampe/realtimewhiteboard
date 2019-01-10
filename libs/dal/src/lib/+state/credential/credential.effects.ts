import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { undo } from 'ngrx-undo';
import { map, mapTo } from 'rxjs/operators';
import { DalActions, DalState } from '..';
import {
  CredentialServiceInterface,
  CREDENTIAL_SERVICE_TOKEN
} from '../../persons';
import {
  CredentialsActionTypes,
  CredentialsLoaded,
  CredentialsLoadError,
  LoadCredentials,
  UnlinkCredential
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
        return this.credentialService.unlinkCredential(action.payload.id).pipe(
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

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<DalState>,
    @Inject(CREDENTIAL_SERVICE_TOKEN)
    private credentialService: CredentialServiceInterface
  ) {}
}
