import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { PassportUserCredentialInterface } from '../../+models';
import {
  CredentialsActions,
  CredentialsActionTypes
} from './credential.actions';

export const NAME = 'credentials';

export interface State extends EntityState<PassportUserCredentialInterface> {
  // additional entities state properties
  loaded: boolean;
  error?: any;
}

export const adapter: EntityAdapter<PassportUserCredentialInterface> = createEntityAdapter<
  PassportUserCredentialInterface
>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  loaded: false
});

export function reducer(
  state = initialState,
  action: CredentialsActions
): State {
  switch (action.type) {
    case CredentialsActionTypes.CredentialsLoaded: {
      return adapter.addAll(action.payload.credentials, {
        ...state,
        loaded: true
      });
    }

    case CredentialsActionTypes.CredentialsLoadError: {
      return { ...state, error: action.payload, loaded: false };
    }

    case CredentialsActionTypes.UnlinkCredential: {
      return adapter.removeOne(action.payload.credential.id, state);
    }

    default: {
      return state;
    }
  }
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = adapter.getSelectors();
