import { Update } from '@ngrx/entity';
import { Action } from '@ngrx/store';
import { StudentContentStatusInterface } from '../../+models';

export enum StudentContentStatusesActionTypes {
  StudentContentStatusesLoaded = '[StudentContentStatuses] StudentContentStatuses Loaded',
  StudentContentStatusesLoadError = '[StudentContentStatuses] Load Error',
  LoadStudentContentStatuses = '[StudentContentStatuses] Load StudentContentStatuses',
  AddStudentContentStatus = '[StudentContentStatuses] Add StudentContentStatus',
  UpsertStudentContentStatus = '[StudentContentStatuses] Upsert StudentContentStatus',
  AddStudentContentStatuses = '[StudentContentStatuses] Add StudentContentStatuses',
  UpsertStudentContentStatuses = '[StudentContentStatuses] Upsert StudentContentStatuses',
  UpdateStudentContentStatus = '[StudentContentStatuses] Update StudentContentStatus',
  UpdateStudentContentStatuses = '[StudentContentStatuses] Update StudentContentStatuses',
  DeleteStudentContentStatus = '[StudentContentStatuses] Delete StudentContentStatus',
  DeleteStudentContentStatuses = '[StudentContentStatuses] Delete StudentContentStatuses',
  ClearStudentContentStatuses = '[StudentContentStatuses] Clear StudentContentStatuses'
}

export class LoadStudentContentStatuses implements Action {
  readonly type = StudentContentStatusesActionTypes.LoadStudentContentStatuses;

  constructor(public payload: { force?: boolean }) {}
}

export class StudentContentStatusesLoaded implements Action {
  readonly type =
    StudentContentStatusesActionTypes.StudentContentStatusesLoaded;

  constructor(
    public payload: { StudentContentStatuses: StudentContentStatusInterface[] }
  ) {}
}

export class StudentContentStatusesLoadError implements Action {
  readonly type =
    StudentContentStatusesActionTypes.StudentContentStatusesLoadError;
  constructor(public payload: any) {}
}

export class AddStudentContentStatus implements Action {
  readonly type = StudentContentStatusesActionTypes.AddStudentContentStatus;

  constructor(
    public payload: { studentContentStatus: StudentContentStatusInterface }
  ) {}
}

export class UpsertStudentContentStatus implements Action {
  readonly type = StudentContentStatusesActionTypes.UpsertStudentContentStatus;

  constructor(
    public payload: { studentContentStatus: StudentContentStatusInterface }
  ) {}
}

export class AddStudentContentStatuses implements Action {
  readonly type = StudentContentStatusesActionTypes.AddStudentContentStatuses;

  constructor(
    public payload: { StudentContentStatuses: StudentContentStatusInterface[] }
  ) {}
}

export class UpsertStudentContentStatuses implements Action {
  readonly type =
    StudentContentStatusesActionTypes.UpsertStudentContentStatuses;

  constructor(
    public payload: { StudentContentStatuses: StudentContentStatusInterface[] }
  ) {}
}

export class UpdateStudentContentStatus implements Action {
  readonly type = StudentContentStatusesActionTypes.UpdateStudentContentStatus;

  constructor(
    public payload: {
      studentContentStatus: Update<StudentContentStatusInterface>;
    }
  ) {}
}

export class UpdateStudentContentStatuses implements Action {
  readonly type =
    StudentContentStatusesActionTypes.UpdateStudentContentStatuses;

  constructor(
    public payload: {
      StudentContentStatuses: Update<StudentContentStatusInterface>[];
    }
  ) {}
}

export class DeleteStudentContentStatus implements Action {
  readonly type = StudentContentStatusesActionTypes.DeleteStudentContentStatus;

  constructor(public payload: { id: number }) {}
}

export class DeleteStudentContentStatuses implements Action {
  readonly type =
    StudentContentStatusesActionTypes.DeleteStudentContentStatuses;

  constructor(public payload: { ids: number[] }) {}
}

export class ClearStudentContentStatuses implements Action {
  readonly type = StudentContentStatusesActionTypes.ClearStudentContentStatuses;
}

export type StudentContentStatusesActions =
  | LoadStudentContentStatuses
  | StudentContentStatusesLoaded
  | StudentContentStatusesLoadError
  | AddStudentContentStatus
  | UpsertStudentContentStatus
  | AddStudentContentStatuses
  | UpsertStudentContentStatuses
  | UpdateStudentContentStatus
  | UpdateStudentContentStatuses
  | DeleteStudentContentStatus
  | DeleteStudentContentStatuses
  | ClearStudentContentStatuses;
