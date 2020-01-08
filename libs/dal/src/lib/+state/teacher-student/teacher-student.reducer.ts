import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { TeacherStudentInterface } from '../../+models';
import {
  TeacherStudentActions,
  TeacherStudentActionTypes
} from './teacher-student.actions';

export const NAME = 'teacherStudents';

export interface State extends EntityState<TeacherStudentInterface> {
  // additional entities state properties
  loaded: boolean;
  error?: any;
}

export const adapter: EntityAdapter<TeacherStudentInterface> = createEntityAdapter<
  TeacherStudentInterface
>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  loaded: false
});

export function reducer(
  state = initialState,
  action: TeacherStudentActions
): State {
  switch (action.type) {
    case TeacherStudentActionTypes.AddTeacherStudent: {
      return adapter.addOne(action.payload.teacherStudent, state);
    }

    case TeacherStudentActionTypes.AddTeacherStudents: {
      return adapter.addMany(action.payload.teacherStudents, state);
    }

    case TeacherStudentActionTypes.DeleteTeacherStudent: {
      return adapter.removeOne(action.payload.id, state);
    }

    case TeacherStudentActionTypes.DeleteTeacherStudents: {
      return adapter.removeMany(action.payload.ids, state);
    }

    case TeacherStudentActionTypes.TeacherStudentsLoaded: {
      return adapter.addAll(action.payload.teacherStudents, {
        ...state,
        loaded: true
      });
    }

    case TeacherStudentActionTypes.TeacherStudentsLoadError: {
      return { ...state, error: action.payload, loaded: false };
    }

    case TeacherStudentActionTypes.ClearTeacherStudents: {
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
