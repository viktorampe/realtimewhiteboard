import { TestBed } from '@angular/core/testing';
import { BROWSER_STORAGE_SERVICE_TOKEN, StorageService } from '@campus/browser';
import { ListFormat } from '@campus/ui';
import { EffectsModule } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { ROUTER_NAVIGATION } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { DataPersistence, NxModule } from '@nrwl/nx';
import { hot } from '@nrwl/nx/testing';
import { Observable, of } from 'rxjs';
import {
  LoadUi,
  SaveUi,
  SetBreadcrumbs,
  SetListFormat,
  UiLoaded
} from './ui.actions';
import { UiEffects } from './ui.effects';
import { initialState, reducer } from './ui.reducer';

describe('UiEffects', () => {
  let actions: Observable<any>;
  let effects: UiEffects;
  let storageService: StorageService;
  let uiStoredData: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NxModule.forRoot(),
        StoreModule.forRoot({}),
        EffectsModule.forRoot([])
      ],
      providers: [
        UiEffects,
        DataPersistence,
        provideMockActions(() => actions),
        { provide: BROWSER_STORAGE_SERVICE_TOKEN, useClass: StorageService }
      ]
    });

    effects = TestBed.get(UiEffects);
  });

  describe('loadUi$', () => {
    let spy: jest.SpyInstance;

    beforeEach(() => {
      storageService = TestBed.get(BROWSER_STORAGE_SERVICE_TOKEN);
      spy = jest.spyOn(storageService, 'get');
    });

    afterEach(() => {
      spy.mockRestore();
    });

    it('get data from the storage service', () => {
      uiStoredData = { listFormat: 'GRID' };
      spy.mockReturnValue(JSON.stringify(uiStoredData));
      actions = hot('-a-|', { a: new LoadUi() });
      expect(effects.loadUi$).toBeObservable(
        hot('-a-|', {
          a: new UiLoaded({ state: { ...uiStoredData, loaded: true } })
        })
      );
    });

    it('should return initial state on corrupt json', () => {
      spy.mockReturnValue('try-to-parse-me');
      actions = hot('-a-|', { a: new LoadUi() });
      expect(effects.loadUi$).toBeObservable(
        hot('-a-|', {
          a: new UiLoaded({ state: { loaded: true } })
        })
      );
    });

    it('should return initial state on empty json', () => {
      spy.mockReturnValue('');
      actions = hot('-a-|', { a: new LoadUi() });
      expect(effects.loadUi$).toBeObservable(
        hot('-a-|', {
          a: new UiLoaded({ state: { loaded: true } })
        })
      );
    });

    it('should return initial state on localstorage error', () => {
      spy.mockImplementation(() => {
        throw new Error();
      });
      actions = hot('-a-|', { a: new LoadUi() });
      expect(effects.loadUi$).toBeObservable(
        hot('-a-|', {
          a: new UiLoaded({ state: { loaded: true } })
        })
      );
    });
  });

  describe('localStorage$', () => {
    it('should trigger saveUi$', () => {
      actions = hot('-a-|', {
        a: new SetListFormat({ listFormat: ListFormat.GRID })
      });
      expect(effects.localStorage$).toBeObservable(
        hot('-a-|', { a: new SaveUi() })
      );
      expect(effects.saveUi$).toBeObservable(hot('---|'));
    });

    it('should not trigger saveUi$', () => {
      actions = hot('-a-|', {
        a: new LoadUi()
      });
      expect(effects.localStorage$).toBeObservable(hot('---|'));
    });

    it('should not trigger saveUi$', () => {
      actions = hot('-a-|', {
        a: { type: 'lalalala' }
      });
      expect(effects.localStorage$).toBeObservable(hot('---|'));
    });
  });

  describe('saveUi$', () => {
    let spy: jest.SpyInstance;

    beforeEach(() => {
      storageService = TestBed.get(BROWSER_STORAGE_SERVICE_TOKEN);
      spy = jest.spyOn(storageService, 'set');
    });

    afterEach(() => {
      spy.mockRestore();
    });
    it('should trigger localStorage.set', () => {
      const action: UiLoaded = new UiLoaded({
        state: {
          ...initialState,
          listFormat: ListFormat.GRID
        }
      });
      reducer(initialState, action);
      hot('-a-|', {
        a: new SaveUi()
      }).subscribe(() => {
        expect(spy).toHaveBeenCalled();
      });
    });
  });

  describe('breadcrumbs$', () => {
    it('should trigger on a Router Navigation action', () => {
      const mockRouterState = {
        url: 'foo',
        params: {},
        queryParams: {},
        routeParts: []
      };

      actions = of({
        type: ROUTER_NAVIGATION,
        payload: { routerState: mockRouterState }
      });

      expect(effects.breadcrumbs$).toBeObservable(
        hot('(a|)', { a: new SetBreadcrumbs({ breadcrumbs: [] }) })
      );
    });

    it('should dispatch a SetBreadCrumbs action with the breadcrumb data', () => {
      // moved to bottom of file for readability
      const mockRouterState = getMockRouterState();

      const expected = [
        { displayText: 'bundles', link: ['bundles'] },
        { displayText: 'learningAreaName', link: ['bundles', '19'] },
        {
          displayText: 'returnString instead of object',
          link: ['bundles', '19', '1']
        }
      ];

      actions = of({
        type: ROUTER_NAVIGATION,
        payload: { routerState: mockRouterState }
      });

      expect(effects.breadcrumbs$).toBeObservable(
        hot('(a|)', { a: new SetBreadcrumbs({ breadcrumbs: expected }) })
      );
    });
  });
});

function getMockRouterState() {
  // copy-paste of actual data
  return {
    url: '/bundles/19/1',
    params: {
      area: '19',
      bundle: '1'
    },
    queryParams: {},
    routeParts: [
      {
        url: '',
        params: {},
        data: {}
      },
      {
        url: '',
        params: {},
        data: {}
      },
      {
        url: 'bundles',
        params: {},
        data: {
          breadcrumbText: 'bundles'
        }
      },
      {
        url: '19',
        params: {
          area: '19'
        },
        data: {
          breadcrumbText: 'bundles',
          selector: () => ({ name: 'learningAreaName' }),
          displayProperty: 'name',
          isResolved: true
        }
      },
      {
        url: '1',
        params: {
          area: '19',
          bundle: '1'
        },
        data: {
          breadcrumbText: 'bundles',
          selector: () => 'returnString instead of object',
          isResolved: true
        }
      },
      {
        url: '',
        params: {
          area: '19',
          bundle: '1'
        },
        data: {
          breadcrumbText: 'bundles',
          displayProperty: 'name',
          isResolved: true
        }
      }
    ]
  };
}
