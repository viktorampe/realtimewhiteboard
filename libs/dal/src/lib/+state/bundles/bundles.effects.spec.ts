import { TestBed, async } from '@angular/core/testing';

import { Observable } from 'rxjs';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { provideMockActions } from '@ngrx/effects/testing';

import { NxModule } from '@nrwl/nx';
import { DataPersistence } from '@nrwl/nx';
import { hot } from '@nrwl/nx/testing';

import { BundlesEffects } from './bundles.effects';
import { LoadBundles, BundlesLoaded } from './bundles.actions';

describe('BundlesEffects', () => {
  let actions: Observable<any>;
  let effects: BundlesEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NxModule.forRoot(),
        StoreModule.forRoot({}),
        EffectsModule.forRoot([])
      ],
      providers: [
        BundlesEffects,
        DataPersistence,
        provideMockActions(() => actions)
      ]
    });

    effects = TestBed.get(BundlesEffects);
  });

  describe('loadBundles$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: new LoadBundles() });
      expect(effects.loadBundles$).toBeObservable(
        hot('-a-|', { a: new BundlesLoaded([]) })
      );
    });
  });
});
