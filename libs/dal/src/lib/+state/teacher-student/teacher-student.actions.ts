import { Update } from '@ngrx/entity';
import { Action } from '@ngrx/store';
import { TeacherStudentInterface } from '../../+models';

export enum TeacherStudentActionTypes {
  TeacherStudentsLoaded = '[TeacherStudents] TeacherStudents Loaded',
  TeacherStudentsLoadError = '[TeacherStudents] Load Error',
  LoadTeacherStudents = '[TeacherStudents] Load TeacherStudents',
  AddTeacherStudent = '[TeacherStudents] Add TeacherStudent',
  UpsertTeacherStudent = '[TeacherStudents] Upsert TeacherStudent',
  AddTeacherStudents = '[TeacherStudents] Add TeacherStudents',
  UpsertTeacherStudents = '[TeacherStudents] Upsert TeacherStudents',
  UpdateTeacherStudent = '[TeacherStudents] Update TeacherStudent',
  UpdateTeacherStudents = '[TeacherStudents] Update TeacherStudents',
  DeleteTeacherStudent = '[TeacherStudents] Delete TeacherStudent',
  DeleteTeacherStudents = '[TeacherStudents] Delete TeacherStudents',
  ClearTeacherStudents = '[TeacherStudents] Clear TeacherStudents'
}

export class LoadTeacherStudents implements Action {
  readonly type = TeacherStudentActionTypes.LoadTeacherStudents;

  constructor(
    public payload: { force?: boolean; userId: number } = { userId: null }
  ) {}
}

export class TeacherStudentsLoaded implements Action {
  readonly type = TeacherStudentActionTypes.TeacherStudentsLoaded;

  constructor(public payload: { teacherStudents: TeacherStudentInterface[] }) {}
}

export class TeacherStudentsLoadError implements Action {
  readonly type = TeacherStudentActionTypes.TeacherStudentsLoadError;
  constructor(public payload: any) {}
}

export class AddTeacherStudent implements Action {
  readonly type = TeacherStudentActionTypes.AddTeacherStudent;

  constructor(public payload: { teacherStudent: TeacherStudentInterface }) {}
}

export class UpsertTeacherStudent implements Action {
  readonly type = TeacherStudentActionTypes.UpsertTeacherStudent;

  constructor(public payload: { teacherStudent: TeacherStudentInterface }) {}
}

export class AddTeacherStudents implements Action {
  readonly type = TeacherStudentActionTypes.AddTeacherStudents;

  constructor(public payload: { teacherStudents: TeacherStudentInterface[] }) {}
}

export class UpsertTeacherStudents implements Action {
  readonly type = TeacherStudentActionTypes.UpsertTeacherStudents;

  constructor(public payload: { teacherStudents: TeacherStudentInterface[] }) {}
}

export class UpdateTeacherStudent implements Action {
  readonly type = TeacherStudentActionTypes.UpdateTeacherStudent;

  constructor(
    public payload: { teacherStudent: Update<TeacherStudentInterface> }
  ) {}
}

export class UpdateTeacherStudents implements Action {
  readonly type = TeacherStudentActionTypes.UpdateTeacherStudents;

  constructor(
    public payload: { teacherStudents: Update<TeacherStudentInterface>[] }
  ) {}
}

export class DeleteTeacherStudent implements Action {
  readonly type = TeacherStudentActionTypes.DeleteTeacherStudent;

  constructor(public payload: { id: number }) {}
}

export class DeleteTeacherStudents implements Action {
  readonly type = TeacherStudentActionTypes.DeleteTeacherStudents;

  constructor(public payload: { ids: number[] }) {}
}

export class ClearTeacherStudents implements Action {
  readonly type = TeacherStudentActionTypes.ClearTeacherStudents;
}

export type TeacherStudentActions =
  | LoadTeacherStudents
  | TeacherStudentsLoaded
  | TeacherStudentsLoadError
  | AddTeacherStudent
  | UpsertTeacherStudent
  | AddTeacherStudents
  | UpsertTeacherStudents
  | UpdateTeacherStudent
  | UpdateTeacherStudents
  | DeleteTeacherStudent
  | DeleteTeacherStudents
  | ClearTeacherStudents;
