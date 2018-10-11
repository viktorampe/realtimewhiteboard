import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { map } from 'rxjs/operators';
import {
  StudentContentStatuseserviceInterface,
  STUDENT_CONTENT_STATUS_SERVICE_TOKEN
} from '../../student-content-status/student-content-status.service.interface';
import {
  LoadStudentContentStatuses,
  StudentContentStatusesActionTypes,
  StudentContentStatusesLoaded,
  StudentContentStatusesLoadError
} from './student-content-status.actions';
import { State } from './student-content-status.reducer';

@Injectable()
export class StudentContentStatusesEffects {
  @Effect()
  loadStudentContentStatuses$ = this.dataPersistence.fetch(
    StudentContentStatusesActionTypes.LoadStudentContentStatuses,
    {
      run: (action: LoadStudentContentStatuses, state: any) => {
        if (!action.payload.force && state.studentContentStatus.loaded) return;
        return this.StudentContentStatuseservice.getAll().pipe(
          map(
            StudentContentStatuses =>
              new StudentContentStatusesLoaded({ StudentContentStatuses })
          )
        );
      },
      onError: (action: LoadStudentContentStatuses, error) => {
        return new StudentContentStatusesLoadError(error);
      }
    }
  );

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<State>,
    @Inject(STUDENT_CONTENT_STATUS_SERVICE_TOKEN)
    private StudentContentStatuseservice: StudentContentStatuseserviceInterface
  ) {}
}
