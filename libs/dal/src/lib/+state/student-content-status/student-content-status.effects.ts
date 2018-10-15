import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { map } from 'rxjs/operators';
import {
  StudentContentStatusServiceInterface,
  STUDENT_CONTENT_STATUS_SERVICE_TOKEN
} from '../../student-content-status/student-content-status.service.interface';
import { StudentContentStatusInterface } from './../../+models/StudentContentStatus.interface';
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

  @Effect()
  updateStudentContentStatuses$ = this.dataPersistence.optimisticUpdate(
    StudentContentStatusesActionTypes.UpdateStudentContentStatus,
    {
      run: (action: UpdateStudentContentStatus, state: any) => {
        const newValue: StudentContentStatusInterface = {
          ...{ id: <number>action.payload.studentContentStatus.id },
          ...action.payload.studentContentStatus.changes
        };
        this.studentContentStatusesService
          .updateStudentContentStatus(newValue)
          .subscribe();
        // TODO: return type? research optimistic updates
      },
      undoAction: (action: UpdateStudentContentStatus, e: any) => {
        return {
          type: 'UNDO_UPDATE_TODO',
          payload: action
        };
      }
    }
  );

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<State>,
    @Inject(STUDENT_CONTENT_STATUS_SERVICE_TOKEN)
    private studentContentStatusesService: StudentContentStatusServiceInterface
  ) {}
}
