import { TestBed } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { StoreModule } from '@ngrx/store';
import { DataPersistence, NxModule } from '@nrwl/nx';
import { hot } from '@nrwl/nx/testing';
import { configureTestSuite } from 'ng-bullet';
import { Observable } from 'rxjs';
import { AppLoaded, LoadApp } from './app.actions';
import { AppEffects } from './app.effects';

describe('AppEffects', () => {
  let actions: Observable<any>;
  let effects: AppEffects;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        NxModule.forRoot(),
        StoreModule.forRoot({}),
        EffectsModule.forRoot([])
      ],
      providers: [
        AppEffects,
        DataPersistence,
        provideMockActions(() => actions)
      ]
    });

    effects = TestBed.get(AppEffects);
  });

  describe('loadApp$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: new LoadApp() });
      expect(effects.loadApp$).toBeObservable(
        hot('-a-|', { a: new AppLoaded([]) })
      );
    });
  });
});
