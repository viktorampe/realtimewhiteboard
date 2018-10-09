import { Inject, Injectable } from '@angular/core';
import {
  BROWSER_STORAGE_SERVICE_TOKEN,
  StorageServiceInterface
} from '@campus/browser';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { filter, map } from 'rxjs/operators';
import { LoadUi, SaveUi, UiActionTypes, UiLoaded } from './ui.actions';
import { UiState } from './ui.reducer';

@Injectable()
export class UiEffects {
  @Effect()
  loadUi$ = this.dataPersistence.fetch(UiActionTypes.LoadUi, {
    run: (action: LoadUi, state: UiState) => {
      // todo fetch all from localStorage
      let data;
      try {
        data = this.storageService.get('ui');
        data = JSON.parse(data);
      } catch (error) {
        //just return the initial state on error
        return new UiLoaded(<UiState>{ ...state, loaded: true });
      }
      return new UiLoaded(<UiState>{ ...data, loaded: true });
    }
  });

  @Effect()
  localStorage$ = this.actions$.pipe(
    filter(action => {
      const excludes = [
        UiActionTypes.LoadUi,
        UiActionTypes.UiLoaded,
        UiActionTypes.SaveUi
      ];
      return excludes.indexOf(<UiActionTypes>action.type) === -1;
    }),
    ofType(...Object.values(UiActionTypes)),
    map(() => new SaveUi())
  );

  @Effect()
  saveUi$ = this.dataPersistence.fetch(UiActionTypes.SaveUi, {
    run: (action: SaveUi, state: UiState) => {
      // todo fetch all from localStorage
      try {
        this.storageService.set('ui', JSON.stringify(state));
      } catch (error) {
        // we don't want errors on failing localstorage, because it's not breaking
      }
    }
  });

  constructor(
    private actions$: Actions,
    private dataPersistence: DataPersistence<UiState>,
    @Inject(BROWSER_STORAGE_SERVICE_TOKEN)
    private storageService: StorageServiceInterface
  ) {}
}
