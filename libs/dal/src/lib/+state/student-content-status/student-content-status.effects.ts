import { Inject, Injectable } from '@angular/core';
import { StudentContentStatusInterface } from '@campus/dal';
import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { DataPersistence } from '@nrwl/nx';
import { undo } from 'ngrx-undo';
import { map } from 'rxjs/operators';
import { DalActions } from '..';
import {
  StudentContentStatusServiceInterface,
  STUDENT_CONTENT_STATUS_SERVICE_TOKEN
} from '../../student-content-status/student-content-status.service.interface';
import { DalState } from '../dal.state.interface';
import {
  AddStudentContentStatus,
  LoadStudentContentStatuses,
  StudentContentStatusesActionTypes,
  StudentContentStatusesLoaded,
  StudentContentStatusesLoadError,
  UpdateStudentContentStatus
} from './student-content-status.actions';

let undoAction: any;
@Injectable()
export class StudentContentStatusesEffects {
  @Effect()
  loadStudentContentStatuses$ = this.dataPersistence.fetch(
    StudentContentStatusesActionTypes.LoadStudentContentStatuses,
    {
      run: (action: LoadStudentContentStatuses, state: DalState) => {
        if (!action.payload.force && state.studentContentStatuses.loaded)
          return;

        return this.studentContentStatusesService
          .getAllByStudentId(action.payload.studentId)
          .pipe(
            map(
              studentContentStatuses =>
                new StudentContentStatusesLoaded({ studentContentStatuses })
            )
          );
      },
      onError: (action: LoadStudentContentStatuses, error) => {
        return new StudentContentStatusesLoadError(error);
      }
    }
  );

  @Effect()
  updateStudentContentStatus$ = this.dataPersistence.optimisticUpdate(
    StudentContentStatusesActionTypes.UpdateStudentContentStatus,
    {
      run: (action: UpdateStudentContentStatus, state: DalState) => {
        undoAction = action;
        const statusId = <number>action.payload.studentContentStatus.id;

        const newValue: StudentContentStatusInterface = {
          ...{ id: statusId },
          ...action.payload.studentContentStatus.changes
        };

        return this.studentContentStatusesService
          .updateStudentContentStatus(newValue)
          .pipe(
            map(
              () =>
                new DalActions.ActionSuccessful({
                  successfulAction: action.type
                })
            )
          );
      },
      undoAction: (action: UpdateStudentContentStatus, error: any) => {
        //TODO handle the undo
        this.store.dispatch(undo(undoAction));
        console.log({ error, action });
        return null;
      }
    }
  );

  @Effect()
  addStudentContentStatuses$ = this.dataPersistence.optimisticUpdate(
    StudentContentStatusesActionTypes.AddStudentContentStatus,
    {
      run: (action: AddStudentContentStatus, state: DalState) => {
        const newValue = action.payload.studentContentStatus;

        return this.studentContentStatusesService
          .addStudentContentStatus(newValue)
          .pipe(
            map(
              () =>
                new DalActions.ActionSuccessful({
                  successfulAction: action.type
                })
            )
          );
      },
      undoAction: (action: AddStudentContentStatus, error: any) => {
        //TODO handle the undo
        console.log({ error, action });
        return null;
      }
    }
  );

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<DalState>,
    @Inject(STUDENT_CONTENT_STATUS_SERVICE_TOKEN)
    private studentContentStatusesService: StudentContentStatusServiceInterface,
    private store: Store<DalState>
  ) {}
}
