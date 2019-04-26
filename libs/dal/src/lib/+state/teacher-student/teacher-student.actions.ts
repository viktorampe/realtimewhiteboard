import { Action } from '@ngrx/store';
import { TeacherStudentInterface } from '../../+models';

export enum TeacherStudentActionTypes {
  TeacherStudentsLoaded = '[TeacherStudents] TeacherStudents Loaded',
  TeacherStudentsLoadError = '[TeacherStudents] Load Error',
  LoadTeacherStudents = '[TeacherStudents] Load TeacherStudents',
  AddTeacherStudent = '[TeacherStudents] Add TeacherStudent',
  AddTeacherStudents = '[TeacherStudents] Add TeacherStudents',
  DeleteTeacherStudent = '[TeacherStudents] Delete TeacherStudent',
  DeleteTeacherStudents = '[TeacherStudents] Delete TeacherStudents',
  ClearTeacherStudents = '[TeacherStudents] Clear TeacherStudents',
  LinkTeacherStudent = '[TeacherStudents] Link Teacher to Student',
  UnlinkTeacherStudent = '[TeacherStudents] Unlink Teacher from Student'
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

export class AddTeacherStudents implements Action {
  readonly type = TeacherStudentActionTypes.AddTeacherStudents;

  constructor(public payload: { teacherStudents: TeacherStudentInterface[] }) {}
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

export class LinkTeacherStudent implements Action {
  readonly type = TeacherStudentActionTypes.LinkTeacherStudent;

  constructor(
    public payload: {
      publicKey: string;
      userId: number;
      handleErrorAutomatically: boolean;
    }
  ) {}
}

export class UnlinkTeacherStudent implements Action {
  readonly type = TeacherStudentActionTypes.UnlinkTeacherStudent;

  constructor(public payload: { teacherId: number; userId: number }) {}
}

export type TeacherStudentActions =
  | LoadTeacherStudents
  | TeacherStudentsLoaded
  | TeacherStudentsLoadError
  | AddTeacherStudent
  | AddTeacherStudents
  | DeleteTeacherStudent
  | DeleteTeacherStudents
  | ClearTeacherStudents
  | LinkTeacherStudent
  | UnlinkTeacherStudent;
