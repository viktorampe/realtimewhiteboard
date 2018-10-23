import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { map } from 'rxjs/operators';
import {
  BundleServiceInterface,
  BUNDLE_SERVICE_TOKEN
} from '../../bundle/bundle.service.interface';
import { DalState } from '../dal.state.interface';
import {
  BundlesActionTypes,
  BundlesLoaded,
  BundlesLoadError,
  LoadBundles
} from './bundle.actions';

@Injectable()
export class BundlesEffects {
  @Effect()
  loadBundles$ = this.dataPersistence.fetch(BundlesActionTypes.LoadBundles, {
    run: (action: LoadBundles, state: DalState) => {
      if (!action.payload.force && state.bundles.loaded) return;
      return this.bundleService
        .getAllForUser(action.payload.userId)
        .pipe(map(bundles => new BundlesLoaded({ bundles })));
    },
    onError: (action: LoadBundles, error) => {
      return new BundlesLoadError(error);
    }
  });

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<DalState>,
    @Inject(BUNDLE_SERVICE_TOKEN) private bundleService: BundleServiceInterface
  ) {}
}
