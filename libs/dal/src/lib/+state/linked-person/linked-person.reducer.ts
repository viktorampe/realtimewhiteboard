import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { TeacherStudentInterface } from '../../+models';
import {
  LinkedPersonsActions,
  LinkedPersonsActionTypes
} from './linked-person.actions';

export const NAME = 'linkedPersons';

export interface State extends EntityState<TeacherStudentInterface> {
  // additional entities state properties
  loaded: boolean;
  error?: any;
}

export const adapter: EntityAdapter<
  TeacherStudentInterface
> = createEntityAdapter<TeacherStudentInterface>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  loaded: false
});

export function reducer(
  state = initialState,
  action: LinkedPersonsActions
): State {
  switch (action.type) {
    case LinkedPersonsActionTypes.AddLinkedPerson: {
      return adapter.addOne(action.payload.linkedPerson, state);
    }

    case LinkedPersonsActionTypes.UpsertLinkedPerson: {
      return adapter.upsertOne(action.payload.linkedPerson, state);
    }

    case LinkedPersonsActionTypes.AddLinkedPersons: {
      return adapter.addMany(action.payload.linkedPersons, state);
    }

    case LinkedPersonsActionTypes.UpsertLinkedPersons: {
      return adapter.upsertMany(action.payload.linkedPersons, state);
    }

    case LinkedPersonsActionTypes.UpdateLinkedPerson: {
      return adapter.updateOne(action.payload.linkedPerson, state);
    }

    case LinkedPersonsActionTypes.UpdateLinkedPersons: {
      return adapter.updateMany(action.payload.linkedPersons, state);
    }

    case LinkedPersonsActionTypes.DeleteLinkedPerson: {
      return adapter.removeOne(action.payload.id, state);
    }

    case LinkedPersonsActionTypes.DeleteLinkedPersons: {
      return adapter.removeMany(action.payload.ids, state);
    }

    case LinkedPersonsActionTypes.LinkedPersonsLoaded: {
      return adapter.addAll(action.payload.linkedPersons, {
        ...state,
        loaded: true
      });
    }

    case LinkedPersonsActionTypes.LinkedPersonsLoadError: {
      return { ...state, error: action.payload, loaded: false };
    }

    case LinkedPersonsActionTypes.ClearLinkedPersons: {
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
