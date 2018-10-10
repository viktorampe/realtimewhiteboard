import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { map } from 'rxjs/operators';
import { BundleServiceInterface, BUNDLE_SERVICE_TOKEN } from '../../bundle/bundle.service.interface';
import {
  BundlesActionTypes,
  BundlesLoadError,
  LoadBundles,
  BundlesLoaded
} from './bundle.actions';
import { State } from './bundle.reducer';

@Injectable()
export class BundlesEffects {
  @Effect()
  loadBundles$ = this.dataPersistence.fetch(
    BundlesActionTypes.LoadBundles,
    {
      run: (action: LoadBundles, state: any) => {
        if (!action.payload.force && state.bundle.loaded) return;
        return this.bundleService
          .getAll()
          .pipe(map(bundles => new BundlesLoaded({ bundles })));
      },
      onError: (action: LoadBundles, error) => {
        return new BundlesLoadError(error);
      }
    }
  );

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<State>,
    @Inject(BUNDLE_SERVICE_TOKEN)
    private bundleService: BundleServiceInterface
  ) {}
}
