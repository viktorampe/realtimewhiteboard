import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { map } from 'rxjs/operators';
import {
  StudentContentStatusServiceInterface,
  STUDENT_CONTENT_STATUS_SERVICE_TOKEN
} from '../../student-content-status/student-content-status.service.interface';
import {
  ContentStatusesActionTypes,
  ContentStatusesLoaded,
  ContentStatusesLoadError,
  LoadContentStatuses
} from './content-status.actions';
import { State } from './content-status.reducer';

// TODO: the injected service will have to be replaced by the 'student content status service'-token

@Injectable()
export class ContentStatusesEffects {
  @Effect()
  loadContentStatuses$ = this.dataPersistence.fetch(
    ContentStatusesActionTypes.LoadContentStatuses,
    {
      run: (action: LoadContentStatuses, state: any) => {
        if (!action.payload.force && state.contentStatuses.loaded) return;
        return this.contentStatusService
          .getAllConstentStatuses()
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
    private dataPersistence: DataPersistence<State>,
    @Inject(STUDENT_CONTENT_STATUS_SERVICE_TOKEN)
    private contentStatusService: StudentContentStatusServiceInterface
  ) {}
}
