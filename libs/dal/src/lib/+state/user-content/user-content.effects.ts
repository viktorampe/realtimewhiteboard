import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { map } from 'rxjs/operators';
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
import { State } from './user-content.reducer';

@Injectable()
export class UserContentsEffects {
  @Effect()
  loadUserContents$ = this.dataPersistence.fetch(
    UserContentsActionTypes.LoadUserContents,
    {
      run: (action: LoadUserContents, state: any) => {
        if (!action.payload.force && state.userContent.loaded) return;
        //TODO, get current user id
        return this.userContentService
          .getAllForUser(1)
          .pipe(map(userContents => new UserContentsLoaded({ userContents })));
      },
      onError: (action: LoadUserContents, error) => {
        return new UserContentsLoadError(error);
      }
    }
  );

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<State>,
    @Inject(USER_CONTENT_SERVICE_TOKEN)
    private userContentService: UserContentServiceInterface
  ) {}
}
