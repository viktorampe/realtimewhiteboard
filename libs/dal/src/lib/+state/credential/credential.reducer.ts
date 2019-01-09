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

export const adapter: EntityAdapter<
  PassportUserCredentialInterface
> = createEntityAdapter<PassportUserCredentialInterface>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  loaded: false
});

export function reducer(
  state = initialState,
  action: CredentialsActions
): State {
  switch (action.type) {
    case CredentialsActionTypes.AddCredential: {
      return adapter.addOne(action.payload.credential, state);
    }

    case CredentialsActionTypes.UpsertCredential: {
      return adapter.upsertOne(action.payload.credential, state);
    }

    case CredentialsActionTypes.AddCredentials: {
      return adapter.addMany(action.payload.credentials, state);
    }

    case CredentialsActionTypes.UpsertCredentials: {
      return adapter.upsertMany(action.payload.credentials, state);
    }

    case CredentialsActionTypes.UpdateCredential: {
      return adapter.updateOne(action.payload.credential, state);
    }

    case CredentialsActionTypes.UpdateCredentials: {
      return adapter.updateMany(action.payload.credentials, state);
    }

    case CredentialsActionTypes.DeleteCredential: {
      return adapter.removeOne(action.payload.id, state);
    }

    case CredentialsActionTypes.DeleteCredentials: {
      return adapter.removeMany(action.payload.ids, state);
    }

    case CredentialsActionTypes.CredentialsLoaded: {
      return adapter.addAll(action.payload.credentials, {
        ...state,
        loaded: true
      });
    }

    case CredentialsActionTypes.CredentialsLoadError: {
      return { ...state, error: action.payload, loaded: false };
    }

    case CredentialsActionTypes.ClearCredentials: {
      return adapter.removeAll(state);
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
