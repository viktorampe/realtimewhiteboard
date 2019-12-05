import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { TaskStudentInterface } from '../../+models';
import {
  TaskStudentsActions,
  TaskStudentsActionTypes
} from './task-student.actions';

export const NAME = 'taskStudents';

export interface State extends EntityState<TaskStudentInterface> {
  // additional entities state properties
  loaded: boolean;
  error?: any;
}

export const adapter: EntityAdapter<TaskStudentInterface> = createEntityAdapter<
  TaskStudentInterface
>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  loaded: false
});

export function reducer(
  state = initialState,
  action: TaskStudentsActions
): State {
  switch (action.type) {
    case TaskStudentsActionTypes.AddTaskStudent: {
      return adapter.addOne(action.payload.taskStudent, state);
    }

    case TaskStudentsActionTypes.UpsertTaskStudent: {
      return adapter.upsertOne(action.payload.taskStudent, state);
    }

    case TaskStudentsActionTypes.AddTaskStudents: {
      return adapter.addMany(action.payload.taskStudents, state);
    }

    case TaskStudentsActionTypes.UpsertTaskStudents: {
      return adapter.upsertMany(action.payload.taskStudents, state);
    }

    case TaskStudentsActionTypes.UpdateTaskStudent: {
      return adapter.updateOne(action.payload.taskStudent, state);
    }

    case TaskStudentsActionTypes.UpdateTaskStudents: {
      return adapter.updateMany(action.payload.taskStudents, state);
    }

    case TaskStudentsActionTypes.DeleteTaskStudent: {
      return adapter.removeOne(action.payload.id, state);
    }

    case TaskStudentsActionTypes.DeleteTaskStudents: {
      return adapter.removeMany(action.payload.ids, state);
    }

    case TaskStudentsActionTypes.TaskStudentsLoaded: {
      return adapter.addAll(action.payload.taskStudents, {
        ...state,
        loaded: true
      });
    }

    case TaskStudentsActionTypes.TaskStudentsLoadError: {
      return { ...state, error: action.payload, loaded: false };
    }

    case TaskStudentsActionTypes.ClearTaskStudents: {
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
