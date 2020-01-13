import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { TaskStudentInterface } from '../../+models';
import * as TaskStudentActions from './task-student.actions';

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

const taskStudentReducer = createReducer(
  initialState,
  on(TaskStudentActions.addTaskStudent, (state, action) =>
    adapter.addOne(action.taskStudent, state)
  ),
  on(TaskStudentActions.upsertTaskStudent, (state, action) =>
    adapter.upsertOne(action.taskStudent, state)
  ),
  on(TaskStudentActions.addTaskStudents, (state, action) =>
    adapter.addMany(action.taskStudents, state)
  ),
  on(TaskStudentActions.upsertTaskStudents, (state, action) =>
    adapter.upsertMany(action.taskStudents, state)
  ),
  on(TaskStudentActions.updateTaskStudent, (state, action) =>
    adapter.updateOne(action.taskStudent, state)
  ),
  on(TaskStudentActions.updateTaskStudents, (state, action) =>
    adapter.updateMany(action.taskStudents, state)
  ),
  on(TaskStudentActions.deleteTaskStudent, (state, action) =>
    adapter.removeOne(action.id, state)
  ),
  on(TaskStudentActions.deleteTaskStudents, (state, action) =>
    adapter.removeMany(action.ids, state)
  ),
  on(TaskStudentActions.clearTaskStudents, state => adapter.removeAll(state)),
  on(TaskStudentActions.taskStudentsLoaded, (state, action) =>
    adapter.addAll(action.taskStudents, { ...state, loaded: true })
  ),
  on(TaskStudentActions.taskStudentsLoadError, (state, action) => {
    return {
      ...state,
      ...{ error: action.error },
      loaded: false
    };
  })
);

export function reducer(state: State | undefined, action: Action) {
  return taskStudentReducer(state, action);
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = adapter.getSelectors();
