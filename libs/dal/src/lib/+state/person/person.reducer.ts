import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { PersonInterface } from '../../+models';
import { PersonsActions, PersonsActionTypes } from './person.actions';

export const NAME = 'persons';

export interface State extends EntityState<PersonInterface> {
  // additional entities state properties
  loaded: boolean;
  error?: any;
}

export const adapter: EntityAdapter<PersonInterface> = createEntityAdapter<
  PersonInterface
>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  loaded: false
});

export function reducer(state = initialState, action: PersonsActions): State {
  switch (action.type) {
    case PersonsActionTypes.AddPerson: {
      return adapter.addOne(action.payload.person, state);
    }

    case PersonsActionTypes.UpsertPerson: {
      return adapter.upsertOne(action.payload.person, state);
    }

    case PersonsActionTypes.AddPersons: {
      return adapter.addMany(action.payload.persons, state);
    }

    case PersonsActionTypes.UpsertPersons: {
      return adapter.upsertMany(action.payload.persons, state);
    }

    case PersonsActionTypes.UpdatePerson: {
      return adapter.updateOne(action.payload.person, state);
    }

    case PersonsActionTypes.UpdatePersons: {
      return adapter.updateMany(action.payload.persons, state);
    }

    case PersonsActionTypes.DeletePerson: {
      return adapter.removeOne(action.payload.id, state);
    }

    case PersonsActionTypes.DeletePersons: {
      return adapter.removeMany(action.payload.ids, state);
    }

    case PersonsActionTypes.PersonsLoaded: {
      return adapter.addAll(action.payload.persons, { ...state, loaded: true });
    }

    case PersonsActionTypes.PersonsLoadError: {
      return { ...state, error: action.payload, loaded: false };
    }

    case PersonsActionTypes.ClearPersons: {
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
