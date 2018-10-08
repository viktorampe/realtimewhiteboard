import { Inject, Injectable } from '@angular/core';
import {
  BROWSER_STORAGE_SERVICE_TOKEN,
  StorageServiceInterface
} from '@campus/browser';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { filter, map, tap } from 'rxjs/operators';
import {
  LoadUi,
  SaveUi,
  UiActionTypes,
  UiLoaded,
  UiLoadError
} from './ui.actions';
import { UiState } from './ui.reducer';

@Injectable()
export class UiEffects {
  @Effect()
  loadUi$ = this.dataPersistence.fetch(UiActionTypes.LoadUi, {
    run: (action: LoadUi, state: UiState) => {
      // todo fetch all from localStorage
      return new UiLoaded(<UiState>{ loaded: true });
    },

    onError: (action: LoadUi, error) => {
      console.error('Error', error);
      return new UiLoadError(error);
    }
  });

  @Effect()
  localStorage$ = this.actions$.pipe(
    tap(console.log),
    filter(action => {
      const excludes = [
        UiActionTypes.LoadUi,
        UiActionTypes.UiLoaded,
        UiActionTypes.UiLoadError,
        UiActionTypes.SaveUi
      ];
      return excludes.indexOf(<UiActionTypes>action.type) === -1;
    }),
    ofType(...Object.keys(UiActionTypes)),
    map(() => new SaveUi())
  );

  @Effect()
  saveUi$ = this.dataPersistence.fetch(UiActionTypes.SaveUi, {
    run: (action: LoadUi, state: UiState) => {
      // todo fetch all from localStorage
      this.storageService.set('ui', JSON.stringify(state));
    },

    onError: (action: LoadUi, error) => {
      console.error('Error', error);
      return new UiLoadError(error);
    }
  });

  constructor(
    private actions$: Actions,
    private dataPersistence: DataPersistence<UiState>,
    @Inject(BROWSER_STORAGE_SERVICE_TOKEN)
    private storageService: StorageServiceInterface
  ) {}
}
