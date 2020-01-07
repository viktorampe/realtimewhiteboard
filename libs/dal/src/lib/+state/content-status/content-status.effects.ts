import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';
import { map } from 'rxjs/operators';
import {
  StudentContentStatusServiceInterface,
  STUDENT_CONTENT_STATUS_SERVICE_TOKEN
} from '../../student-content-status/student-content-status.service.interface';
import { DalState } from '../dal.state.interface';
import {
  ContentStatusesActionTypes,
  ContentStatusesLoaded,
  ContentStatusesLoadError,
  LoadContentStatuses
} from './content-status.actions';

@Injectable()
export class ContentStatusesEffects {
  @Effect()
  loadContentStatuses$ = this.dataPersistence.fetch(
    ContentStatusesActionTypes.LoadContentStatuses,
    {
      run: (action: LoadContentStatuses, state: DalState) => {
        if (!action.payload.force && state.contentStatuses.loaded) return;
        return this.contentStatusService
          .getAllContentStatuses()
          .pipe(
            map(
              contentStatuses => new ContentStatusesLoaded({ contentStatuses })
            )
          );
      },
      onError: (action: LoadContentStatuses, error) => {
        return new ContentStatusesLoadError(error);
      }
    }
  );

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<DalState>,
    @Inject(STUDENT_CONTENT_STATUS_SERVICE_TOKEN)
    private contentStatusService: StudentContentStatusServiceInterface
  ) {}
}
