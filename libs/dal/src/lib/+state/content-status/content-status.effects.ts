import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { map } from 'rxjs/operators';
import { ContentStatusServiceInterface, CONTENT_STATUS_SERVICE_TOKEN } from '../../content-status/content-status.service.interface';
import {
  ContentStatusesActionTypes,
  ContentStatusesLoadError,
  LoadContentStatuses,
  ContentStatusesLoaded
} from './content-status.actions';
import { State } from './content-status.reducer';

@Injectable()
export class ContentStatusesEffects {
  @Effect()
  loadContentStatuses$ = this.dataPersistence.fetch(
    ContentStatusesActionTypes.LoadContentStatuses,
    {
      run: (action: LoadContentStatuses, state: any) => {
        if (!action.payload.force && state.contentStatuses.loaded) return;
        return this.contentStatusService
          .getAll()
          .pipe(map(contentStatuses => new ContentStatusesLoaded({ contentStatuses })));
      },
      onError: (action: LoadContentStatuses, error) => {
        return new ContentStatusesLoadError(error);
      }
    }
  );

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<State>,
    @Inject(CONTENT_STATUS_SERVICE_TOKEN)
    private contentStatusService: ContentStatusServiceInterface
  ) {}
}
