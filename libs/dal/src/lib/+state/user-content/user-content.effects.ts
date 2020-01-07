import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';
import { map } from 'rxjs/operators';
import { DalState } from '..';
import {
  UserContentServiceInterface,
  USER_CONTENT_SERVICE_TOKEN
} from '../../bundle/user-content.service.interface';
import {
  LoadUserContents,
  UserContentsActionTypes,
  UserContentsLoaded,
  UserContentsLoadError
} from './user-content.actions';

@Injectable()
export class UserContentsEffects {
  @Effect()
  loadUserContents$ = this.dataPersistence.fetch(
    UserContentsActionTypes.LoadUserContents,
    {
      run: (action: LoadUserContents, state: DalState) => {
        if (!action.payload.force && state.userContents.loaded) return;
        return this.userContentService
          .getAllForUser(action.payload.userId)
          .pipe(map(userContents => new UserContentsLoaded({ userContents })));
      },
      onError: (action: LoadUserContents, error) => {
        return new UserContentsLoadError(error);
      }
    }
  );

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<DalState>,
    @Inject(USER_CONTENT_SERVICE_TOKEN)
    private userContentService: UserContentServiceInterface
  ) {}
}
