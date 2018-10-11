import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { map } from 'rxjs/operators';
import {
  BundlesServiceInterface,
  BUNDLES_SERVICE_TOKEN
} from '../../bundles/bundles.service.interface';
import {
  BundlesActionTypes,
  BundlesLoaded,
  BundlesLoadError,
  LoadBundles
} from './bundle.actions';
import { State } from './bundle.reducer';

@Injectable()
export class BundlesEffects {
  @Effect()
  loadBundles$ = this.dataPersistence.fetch(BundlesActionTypes.LoadBundles, {
    run: (action: LoadBundles, state: any) => {
      if (!action.payload.force && state.bundle.loaded) return;
      return this.bundleService
        .getAllForUser(1)
        .pipe(map(bundles => new BundlesLoaded({ bundles })));
    },
    onError: (action: LoadBundles, error) => {
      return new BundlesLoadError(error);
    }
  });

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<State>,
    @Inject(BUNDLES_SERVICE_TOKEN)
    private bundleService: BundlesServiceInterface
  ) {}
}
