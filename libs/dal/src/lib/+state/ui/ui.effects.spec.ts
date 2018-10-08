import { TestBed, async } from '@angular/core/testing';

import { Observable } from 'rxjs';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { provideMockActions } from '@ngrx/effects/testing';

import { NxModule } from '@nrwl/nx';
import { DataPersistence } from '@nrwl/nx';
import { hot } from '@nrwl/nx/testing';

import { UiEffects } from './ui.effects';
import { LoadUi, UiLoaded } from './ui.actions';

describe('UiEffects', () => {
  let actions: Observable<any>;
  let effects: UiEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NxModule.forRoot(),
        StoreModule.forRoot({}),
        EffectsModule.forRoot([])
      ],
      providers: [UiEffects, DataPersistence, provideMockActions(() => actions)]
    });

    effects = TestBed.get(UiEffects);
  });

  describe('loadUi$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: new LoadUi() });
      expect(effects.loadUi$).toBeObservable(
        hot('-a-|', { a: new UiLoaded([]) })
      );
    });
  });
});
