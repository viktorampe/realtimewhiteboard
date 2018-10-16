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
  AddStudentContentStatus,
  LoadStudentContentStatuses,
  StudentContentStatusesActionTypes,
  StudentContentStatusesLoaded,
  StudentContentStatusesLoadError,
  UndoAddStudentContentStatus,
  UndoUpdateStudentContentStatus,
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
        const statusId = <number>action.payload.studentContentStatus.id;

        const newValue: StudentContentStatusInterface = {
          ...{ id: statusId },
          ...action.payload.studentContentStatus.changes
        };

        return this.studentContentStatusesService
          .updateStudentContentStatus(newValue)
          .pipe(map(x => null)); //TODO fout afhandelen, verwacht een Action
      },
      undoAction: (action: UpdateStudentContentStatus, e: any) => {
        console.error(e);

        if (action.payload.oldStudentContentStatus) {
          return new UndoUpdateStudentContentStatus({
            studentContentStatus: action.payload.studentContentStatus,
            oldStudentContentStatus: action.payload.oldStudentContentStatus
          });
        } else {
          console.log('UndoAction not possible: no orginal value provided');
          return;
        }
      }
    }
  );

  @Effect({ dispatch: false })
  undoUpdateStudentContentStatuses$ = this.dataPersistence.pessimisticUpdate(
    StudentContentStatusesActionTypes.UndoUpdateStudentContentStatus,
    {
      run: (action: UpdateStudentContentStatus, state: any) => {
        return;
      },
      onError: (action: UpdateStudentContentStatus, e: any) => {}
    }
  );

  @Effect()
  addStudentContentStatuses$ = this.dataPersistence.optimisticUpdate(
    StudentContentStatusesActionTypes.AddStudentContentStatus,
    {
      run: (action: AddStudentContentStatus, state: any) => {
        const newValue = action.payload.studentContentStatus;

        return this.studentContentStatusesService
          .addStudentContentStatus(newValue)
          .pipe(map(x => null)); //TODO fout afhandelen, verwacht een Action
      },
      undoAction: (action: AddStudentContentStatus, e: any) => {
        console.error(e);

        return new UndoAddStudentContentStatus(action.payload);
      }
    }
  );

  @Effect({ dispatch: false })
  undoAddStudentContentStatuses$ = this.dataPersistence.pessimisticUpdate(
    StudentContentStatusesActionTypes.UndoAddStudentContentStatus,
    {
      run: (action: AddStudentContentStatus, state: any) => {
        return;
      },
      onError: (action: AddStudentContentStatus, e: any) => {}
    }
  );

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<State>,
    @Inject(STUDENT_CONTENT_STATUS_SERVICE_TOKEN)
    private studentContentStatusesService: StudentContentStatusServiceInterface
  ) {}
}
