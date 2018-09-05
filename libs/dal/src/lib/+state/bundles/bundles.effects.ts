import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';

import { BundlesState } from './bundles.reducer';
import {
  LoadBundles,
  BundlesLoaded,
  BundlesLoadError,
  BundlesActionTypes
} from './bundles.actions';

@Injectable()
export class BundlesEffects {
  @Effect()
  loadBundles$ = this.dataPersistence.fetch(BundlesActionTypes.LoadBundles, {
    run: (action: LoadBundles, state: BundlesState) => {
      // Your custom REST 'load' logic goes here. For now just return an empty list...
      return new BundlesLoaded([]);
    },

    onError: (action: LoadBundles, error) => {
      console.error('Error', error);
      return new BundlesLoadError(error);
    }
  });

  constructor(
    private actions$: Actions,
    private dataPersistence: DataPersistence<BundlesState>
  ) {}
}
