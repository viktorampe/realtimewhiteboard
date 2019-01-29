import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { PersonInterface } from '../../+models';
import {
  TeacherStudentActions,
  TeacherStudentActionTypes
} from '../teacher-student/teacher-student.actions';
import {
  LinkedPersonsActions,
  LinkedPersonsActionTypes
} from './linked-person.actions';

export const NAME = 'linkedPersons';

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

export function reducer(
  state = initialState,
  action: LinkedPersonsActions | TeacherStudentActions
): State {
  switch (action.type) {
    case LinkedPersonsActionTypes.AddLinkedPerson: {
      return adapter.addOne(action.payload.person, state);
    }

    case LinkedPersonsActionTypes.AddLinkedPersons: {
      return adapter.addMany(action.payload.persons, state);
    }

    case LinkedPersonsActionTypes.DeleteLinkedPerson: {
      return adapter.removeOne(action.payload.id, state);
    }

    case LinkedPersonsActionTypes.DeleteLinkedPersons: {
      return adapter.removeMany(action.payload.ids, state);
    }

    case LinkedPersonsActionTypes.LinkedPersonsLoaded: {
      return adapter.addAll(action.payload.persons, { ...state, loaded: true });
    }

    case LinkedPersonsActionTypes.LinkedPersonsLoadError: {
      return { ...state, error: action.payload, loaded: false };
    }

    case LinkedPersonsActionTypes.ClearLinkedPersons: {
      return adapter.removeAll(state);
    }

    case TeacherStudentActionTypes.LinkTeacherStudent:
    case TeacherStudentActionTypes.UnlinkTeacherStudent:
      return { ...state, loaded: false };

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
