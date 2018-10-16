import { Inject, Injectable } from '@angular/core';
import { StudentContentStatusInterface } from '@campus/dal';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { map } from 'rxjs/operators';
import {
  StudentContentStatusServiceInterface,
  STUDENT_CONTENT_STATUS_SERVICE_TOKEN
} from '../../student-content-status/student-content-status.service.interface';
import {
  LoadStudentContentStatuses,
  StudentContentStatusesActionTypes,
  StudentContentStatusesLoaded,
  StudentContentStatusesLoadError,
  UpdateStudentContentStatus
} from './student-content-status.actions';
import { State } from './student-content-status.reducer';

@Injectable()
export class StudentContentStatusesEffects {
  @Effect()
  loadStudentContentStatuses$ = this.dataPersistence.fetch(
    StudentContentStatusesActionTypes.LoadStudentContentStatuses,
    {
      run: (action: LoadStudentContentStatuses, state: any) => {
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

  @Effect({ dispatch: false }) // nodig als je geen action returned
  updateStudentContentStatuses$ = this.dataPersistence.optimisticUpdate(
    StudentContentStatusesActionTypes.UpdateStudentContentStatus,
    {
      run: (action: UpdateStudentContentStatus, state: any) => {
        const statusId = <number>action.payload.studentContentStatus.id;

        const newValue: StudentContentStatusInterface = {
          ...{ id: statusId },
          ...action.payload.studentContentStatus.changes
        };

        this.studentContentStatusesService.updateStudentContentStatus(newValue);
        // TODO: return type? research optimistic updates
      },
      undoAction: (action: UpdateStudentContentStatus, e: any) => {
        return {
          type:
            StudentContentStatusesActionTypes.UndoUpdateStudentContentStatus,
          payload: action
        };
      }
    }
  );

  @Effect()
  undoUpdateStudentContentStatuses$ = this.dataPersistence.pessimisticUpdate(
    StudentContentStatusesActionTypes.UndoUpdateStudentContentStatus,
    {
      run: (action: UpdateStudentContentStatus, state: any) => {},
      onError: (action: UpdateStudentContentStatus, e: any) => {}
    }
  );

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<State>,
    @Inject(STUDENT_CONTENT_STATUS_SERVICE_TOKEN)
    private studentContentStatusesService: StudentContentStatusServiceInterface
  ) {}
}
