import { Update } from '@ngrx/entity';
import { Action } from '@ngrx/store';
import { TaskStudentInterface } from '../../+models';

export enum TaskStudentsActionTypes {
  TaskStudentsLoaded = '[TaskStudents] TaskStudents Loaded',
  TaskStudentsLoadError = '[TaskStudents] Load Error',
  LoadTaskStudents = '[TaskStudents] Load TaskStudents',
  AddTaskStudent = '[TaskStudents] Add TaskStudent',
  UpsertTaskStudent = '[TaskStudents] Upsert TaskStudent',
  AddTaskStudents = '[TaskStudents] Add TaskStudents',
  UpsertTaskStudents = '[TaskStudents] Upsert TaskStudents',
  UpdateTaskStudent = '[TaskStudents] Update TaskStudent',
  UpdateTaskStudents = '[TaskStudents] Update TaskStudents',
  DeleteTaskStudent = '[TaskStudents] Delete TaskStudent',
  DeleteTaskStudents = '[TaskStudents] Delete TaskStudents',
  ClearTaskStudents = '[TaskStudents] Clear TaskStudents'
}

export class LoadTaskStudents implements Action {
  readonly type = TaskStudentsActionTypes.LoadTaskStudents;

  constructor(
    public payload: { force?: boolean, userId: number } = { userId: null }
  ) {}
}

export class TaskStudentsLoaded implements Action {
  readonly type = TaskStudentsActionTypes.TaskStudentsLoaded;

  constructor(public payload: { taskStudents: TaskStudentInterface[] }) {}
}

export class TaskStudentsLoadError implements Action {
  readonly type = TaskStudentsActionTypes.TaskStudentsLoadError;
  constructor(public payload: any) {}
}

export class AddTaskStudent implements Action {
  readonly type = TaskStudentsActionTypes.AddTaskStudent;

  constructor(public payload: { taskStudent: TaskStudentInterface }) {}
}

export class UpsertTaskStudent implements Action {
  readonly type = TaskStudentsActionTypes.UpsertTaskStudent;

  constructor(public payload: { taskStudent: TaskStudentInterface }) {}
}

export class AddTaskStudents implements Action {
  readonly type = TaskStudentsActionTypes.AddTaskStudents;

  constructor(public payload: { taskStudents: TaskStudentInterface[] }) {}
}

export class UpsertTaskStudents implements Action {
  readonly type = TaskStudentsActionTypes.UpsertTaskStudents;

  constructor(public payload: { taskStudents: TaskStudentInterface[] }) {}
}

export class UpdateTaskStudent implements Action {
  readonly type = TaskStudentsActionTypes.UpdateTaskStudent;

  constructor(public payload: { taskStudent: Update<TaskStudentInterface> }) {}
}

export class UpdateTaskStudents implements Action {
  readonly type = TaskStudentsActionTypes.UpdateTaskStudents;

  constructor(public payload: { taskStudents: Update<TaskStudentInterface>[] }) {}
}

export class DeleteTaskStudent implements Action {
  readonly type = TaskStudentsActionTypes.DeleteTaskStudent;

  constructor(public payload: { id: number }) {}
}

export class DeleteTaskStudents implements Action {
  readonly type = TaskStudentsActionTypes.DeleteTaskStudents;

  constructor(public payload: { ids: number[] }) {}
}

export class ClearTaskStudents implements Action {
  readonly type = TaskStudentsActionTypes.ClearTaskStudents;
}

export type TaskStudentsActions =
  | LoadTaskStudents
  | TaskStudentsLoaded
  | TaskStudentsLoadError
  | AddTaskStudent
  | UpsertTaskStudent
  | AddTaskStudents
  | UpsertTaskStudents
  | UpdateTaskStudent
  | UpdateTaskStudents
  | DeleteTaskStudent
  | DeleteTaskStudents
  | ClearTaskStudents;
