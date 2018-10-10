import { TestBed } from '@angular/core/testing';
import { BundleApi } from '@diekeure/polpo-api-angular-sdk';
import { EffectsModule } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, StoreModule } from '@ngrx/store';
import { DataPersistence, NxModule } from '@nrwl/nx';
import { hot } from '@nrwl/nx/testing';
import { BehaviorSubject, Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { BundleInterface } from '../../+models/Bundle.interface';
import { BundleService } from '../../bundle/bundle.service';
import { BUNDLE_SERVICE_TOKEN } from '../../bundle/bundle.service.interface';
import { BundlesLoaded, LoadBundles, BundlesLoadError } from './bundle.actions';
import { BundlesEffects } from './bundle.effects';
import { initialState, reducer } from './bundle.reducer';

describe('BundleEffects', () => {
  let actions: Observable<any>;
  let effects: BundlesEffects;
  let usedState: any;

  const unforcedLoadAction = new LoadBundles({});
  const forcedLoadAction = new LoadBundles({ force: true });
  const filledLoadedAction = new BundlesLoaded({ bundles: []});
  const loadErrorAction = new BundlesLoadError(
    new Error('failed')
  );

  const expectInAndOut = (triggerAction: Action, effectOutput: any) => {
    actions = hot('-a-|', { a: triggerAction });
    expect(effects.loadBundles$).toBeObservable(
      hot('-a-|', {
        a: effectOutput
      })
    );
  };

  const expectInNoOut = (triggerAction: Action) => {
    actions = hot('-a-|', { a: triggerAction });
    expect(effects.loadBundles$).toBeObservable(hot('---|'));
  };

  const jestMockTokenGetBundlesReturnValue = () => {
    jest
      .spyOn(TestBed.get(BUNDLE_SERVICE_TOKEN), 'getAll')
      .mockReturnValue(
        new BehaviorSubject<BundleInterface[]>([]).pipe(take(1))
      );
  };
  const jestMockTokenGetBundlesError = () => {
    jest
      .spyOn(TestBed.get(BUNDLE_SERVICE_TOKEN), 'getAll')
      .mockImplementation(() => {
        throw new Error('failed');
      });
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NxModule.forRoot(),
        StoreModule.forRoot({}),
        StoreModule.forFeature('bundle', reducer, {
          initialState: usedState
        }),
        EffectsModule.forRoot([]),
        EffectsModule.forFeature([BundlesEffects])
      ],
      providers: [
        {
          provide: BUNDLE_SERVICE_TOKEN,
          useClass: BundleService
        },
        {
          provide: BundleApi,
          userClass: {}
        },
        BundlesEffects,
        DataPersistence,
        provideMockActions(() => actions)
      ]
    });

    effects = TestBed.get(BundlesEffects);
  });

  describe('loadBundle$ with initialState', () => {
    beforeAll(() => {
      usedState = initialState;
    });
    beforeEach(() => {
      jestMockTokenGetBundlesReturnValue();
    });
    it('should trigger an api call with the initialState if force is not true', () => {
      expectInAndOut(unforcedLoadAction, filledLoadedAction);
    });
    it('should trigger an api call with the initialState if force is true', () => {
      expectInAndOut(forcedLoadAction, filledLoadedAction);
    });
  });
  describe('loadBundle$ with loaded state', () => {
    beforeAll(() => {
      usedState = { ...initialState, loaded: true };
    });
    beforeEach(() => {
      jestMockTokenGetBundlesReturnValue();
    });
    it('should not trigger an api call with the loaded state if force is not true', () => {
      expectInNoOut(unforcedLoadAction);
    });
    it('should trigger an api call with the loaded state if force is true', () => {
      expectInAndOut(forcedLoadAction, filledLoadedAction);
    });
  });

  describe('loadBundle$ with initialState and failing api call', () => {
    beforeAll(() => {
      usedState = initialState;
    });
    beforeEach(() => {
      jestMockTokenGetBundlesError();
    });
    it('should return a error action if force is not true', () => {
      expectInAndOut(unforcedLoadAction, loadErrorAction);
    });
    it('should return a error action if force is true', () => {
      expectInAndOut(forcedLoadAction, loadErrorAction);
    });
  });

  describe('loadBundle$ with loaded and failing api call', () => {
    beforeAll(() => {
      usedState = {
        ...initialState,
        loaded: true,
        list: []
      };
    });
    beforeEach(() => {
      jestMockTokenGetBundlesError();
    });
    it('should return nothing action if force is not true', () => {
      expectInNoOut(unforcedLoadAction);
    });
    it('should return a error action if force is true', () => {
      expectInAndOut(forcedLoadAction, loadErrorAction);
    });
  });
});
