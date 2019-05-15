import { Update } from '@ngrx/entity';
import { Action } from '@ngrx/store';
import { StudentContentStatusInterface } from '../../+models';
import {
  CustomFeedbackHandlersInterface,
  FeedbackTriggeringAction
} from '../effect-feedback';

export enum StudentContentStatusesActionTypes {
  StudentContentStatusesLoaded = '[StudentContentStatuses] StudentContentStatuses Loaded',
  StudentContentStatusesLoadError = '[StudentContentStatuses] Load Error',
  LoadStudentContentStatuses = '[StudentContentStatuses] Load StudentContentStatuses',
  AddStudentContentStatus = '[StudentContentStatuses] Add StudentContentStatus',
  StudentContentStatusAdded = '[StudentContentStatus] StudentContentStatus Added',
  UpsertStudentContentStatus = '[StudentContentStatuses] Upsert StudentContentStatus',
  StudentContentStatusUpserted = '[StudentContentStatus] StudentContentStatus Upserted',
  AddStudentContentStatuses = '[StudentContentStatuses] Add StudentContentStatuses',
  UpsertStudentContentStatuses = '[StudentContentStatuses] Upsert StudentContentStatuses',
  UpdateStudentContentStatus = '[StudentContentStatuses] Update StudentContentStatus',
  StudentContentStatusUpdated = '[StudentContentStatus] StudentContentStatus Updated',
  UpdateStudentContentStatuses = '[StudentContentStatuses] Update StudentContentStatuses',
  DeleteStudentContentStatus = '[StudentContentStatuses] Delete StudentContentStatus',
  DeleteStudentContentStatuses = '[StudentContentStatuses] Delete StudentContentStatuses',
  ClearStudentContentStatuses = '[StudentContentStatuses] Clear StudentContentStatuses'
}

export class LoadStudentContentStatuses implements Action {
  readonly type = StudentContentStatusesActionTypes.LoadStudentContentStatuses;

  constructor(public payload: { force?: boolean; studentId: number }) {}
}

export class StudentContentStatusesLoaded implements Action {
  readonly type =
    StudentContentStatusesActionTypes.StudentContentStatusesLoaded;

  constructor(
    public payload: { studentContentStatuses: StudentContentStatusInterface[] }
  ) {}
}

export class StudentContentStatusesLoadError implements Action {
  readonly type =
    StudentContentStatusesActionTypes.StudentContentStatusesLoadError;
  constructor(public payload: any) {}
}

export class AddStudentContentStatus implements FeedbackTriggeringAction {
  readonly type = StudentContentStatusesActionTypes.AddStudentContentStatus;

  constructor(
    public payload: {
      studentContentStatus: StudentContentStatusInterface;
      customFeedbackHandlers?: CustomFeedbackHandlersInterface;
    }
  ) {}
}

export class StudentContentStatusAdded implements Action {
  readonly type = StudentContentStatusesActionTypes.StudentContentStatusAdded;

  constructor(
    public payload: { studentContentStatus: StudentContentStatusInterface }
  ) {}
}

export class UpsertStudentContentStatus implements FeedbackTriggeringAction {
  readonly type = StudentContentStatusesActionTypes.UpsertStudentContentStatus;

  constructor(
    public payload: {
      studentContentStatus: StudentContentStatusInterface;
      customFeedbackHandlers?: CustomFeedbackHandlersInterface;
    }
  ) {}
}

export class StudentContentStatusUpserted implements Action {
  readonly type =
    StudentContentStatusesActionTypes.StudentContentStatusUpserted;

  constructor(
    public payload: { studentContentStatus: StudentContentStatusInterface }
  ) {}
}

export class AddStudentContentStatuses implements Action {
  readonly type = StudentContentStatusesActionTypes.AddStudentContentStatuses;

  constructor(
    public payload: { studentContentStatuses: StudentContentStatusInterface[] }
  ) {}
}

export class UpsertStudentContentStatuses implements Action {
  readonly type =
    StudentContentStatusesActionTypes.UpsertStudentContentStatuses;

  constructor(
    public payload: { studentContentStatuses: StudentContentStatusInterface[] }
  ) {}
}

export class UpdateStudentContentStatus implements FeedbackTriggeringAction {
  readonly type = StudentContentStatusesActionTypes.UpdateStudentContentStatus;

  constructor(
    public payload: {
      studentContentStatus: Update<StudentContentStatusInterface>;
      customFeedbackHandlers?: CustomFeedbackHandlersInterface;
    }
  ) {}
}

export class StudentContentStatusUpdated implements Action {
  readonly type = StudentContentStatusesActionTypes.StudentContentStatusUpdated;

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
      studentContentStatuses: Update<StudentContentStatusInterface>[];
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
  | StudentContentStatusAdded
  | UpsertStudentContentStatus
  | StudentContentStatusUpserted
  | AddStudentContentStatuses
  | UpsertStudentContentStatuses
  | UpdateStudentContentStatus
  | StudentContentStatusUpdated
  | UpdateStudentContentStatuses
  | DeleteStudentContentStatus
  | DeleteStudentContentStatuses
  | ClearStudentContentStatuses;
