import { Component, NgZone } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AUTH_SERVICE_TOKEN,
  CustomSerializer,
  DalState,
  EduContentBookReducer,
  EduContentFixture,
  EduContentReducer,
  EduContentServiceInterface,
  EduContentTocReducer,
  EDU_CONTENT_SERVICE_TOKEN,
  getStoreModuleForFeatures,
  MethodReducer,
  UserReducer
} from '@campus/dal';
import {
  FilterFactoryFixture,
  SearchModeInterface,
  SearchResultInterface,
  SearchStateInterface
} from '@campus/search';
import {
  EduContentSearchResultFixture,
  EnvironmentSearchModesInterface,
  ENVIRONMENT_SEARCHMODES_TOKEN,
  OpenStaticContentServiceInterface,
  OPEN_STATIC_CONTENT_SERVICE_TOKEN,
  ScormExerciseServiceInterface,
  SCORM_EXERCISE_SERVICE_TOKEN
} from '@campus/shared';
import {
  NavigationActionTiming,
  RouterNavigationAction,
  RouterNavigationPayload,
  routerReducer,
  RouterStateSerializer,
  ROUTER_NAVIGATION,
  StoreRouterConnectingModule
} from '@ngrx/router-store';
import { Store, StoreModule } from '@ngrx/store';
import { hot } from '@nrwl/nx/testing';
import { configureTestSuite } from 'ng-bullet';
import { of } from 'rxjs';
import { take } from 'rxjs/operators';
import { GlobalSearchViewModel } from './global-search.viewmodel';

describe('GlobalSearchViewModel', () => {
  let globalSearchViewModel: GlobalSearchViewModel;
  let store: Store<DalState>;
  let router: Router;
  let zone: NgZone;
  let openStaticContentService: OpenStaticContentServiceInterface;
  let scormExerciseService: ScormExerciseServiceInterface;
  let searchModes: EnvironmentSearchModesInterface;
  let eduContentService: EduContentServiceInterface;

  function createMockSearchMode(overrides: Partial<SearchModeInterface>) {
    return Object.assign(
      {
        name: 'demo',
        label: 'demo',
        dynamicFilters: false,
        searchFilterFactory: FilterFactoryFixture,
        searchTerm: {
          // autocompleteEl: string; //reference to material autocomplete component
          domHost: 'hostSearchTerm'
        },
        results: {
          component: null,
          sortModes: [],
          pageSize: 3
        }
      },
      overrides
    ) as SearchModeInterface;
  }

  const mockAutoCompleteReturnValue = ['strings', 'for', 'autocomplete'];

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({ router: routerReducer }),
        ...getStoreModuleForFeatures([
          UserReducer,
          EduContentTocReducer,
          EduContentBookReducer,
          MethodReducer,
          EduContentReducer
        ]),
        RouterTestingModule.withRoutes([
          {
            path: '',
            redirectTo: 'methods',
            pathMatch: 'full'
          },
          {
            path: 'methods',
            component: Component
          }
        ]),
        StoreRouterConnectingModule.forRoot({
          navigationActionTiming: NavigationActionTiming.PostActivation,
          serializer: CustomSerializer
        })
      ],
      providers: [
        Store,
        { provide: RouterStateSerializer, useClass: CustomSerializer },
        { provide: AUTH_SERVICE_TOKEN, useValue: { userId: 1 } },
        {
          provide: EDU_CONTENT_SERVICE_TOKEN,
          useValue: {
            search: () => {},
            autoComplete: () => {}
          }
        },
        {
          provide: ENVIRONMENT_SEARCHMODES_TOKEN,
          useValue: {
            demo: createMockSearchMode({ name: 'demo' }),
            global: createMockSearchMode({ name: 'global' })
          }
        },
        {
          provide: OPEN_STATIC_CONTENT_SERVICE_TOKEN,
          useValue: { open: jest.fn() }
        },
        {
          provide: SCORM_EXERCISE_SERVICE_TOKEN,
          useValue: { previewExerciseFromUnlockedContent: jest.fn() }
        }
      ]
    });
  });

  beforeEach(() => {
    globalSearchViewModel = TestBed.get(GlobalSearchViewModel);
    store = TestBed.get(Store);
    zone = TestBed.get(NgZone);
    router = TestBed.get(Router);
    loadInStore();
    openStaticContentService = TestBed.get(OPEN_STATIC_CONTENT_SERVICE_TOKEN);
    scormExerciseService = TestBed.get(SCORM_EXERCISE_SERVICE_TOKEN);
    eduContentService = TestBed.get(EDU_CONTENT_SERVICE_TOKEN);
    searchModes = TestBed.get(ENVIRONMENT_SEARCHMODES_TOKEN);
  });

  describe('creation', () => {
    it('should be defined', () => {
      expect(globalSearchViewModel).toBeDefined();
    });
  });

  describe('getSearchMode', () => {
    it('should return the requested search mode', () => {
      navigateWithParams({});

      expect(globalSearchViewModel.getSearchMode('demo')).toBeObservable(
        hot('a', {
          a: searchModes['demo']
        })
      );
    });
  });

  describe('initialState', () => {
    const testcases = [
      {
        description: 'should return the correct searchState',
        setup: {
          params: {}
        },
        expected: {
          selections: [] as any[]
        }
      }
    ];

    beforeEach(() => {
      loadInStore();
    });

    testcases.forEach(testcase =>
      it(testcase.description, () => {
        navigateWithParams(testcase.setup.params);

        const initialSearchState$ = globalSearchViewModel.getInitialSearchState();
        const expected: SearchStateInterface = {
          searchTerm: '',
          filterCriteriaSelections: new Map<string, number[]>(
            testcase.expected.selections
          )
        };

        expect(initialSearchState$).toBeObservable(hot('a', { a: expected }));
      })
    );
  });

  describe('updateState', () => {
    it('should emit the value in the searchState$', () => {
      const mockSearchState = {} as SearchStateInterface;

      globalSearchViewModel.updateState(mockSearchState);
      expect(globalSearchViewModel.searchState$).toBeObservable(
        hot('a', { a: mockSearchState })
      );
    });
  });

  describe('searchResult$', () => {
    const mockSearchResult: SearchResultInterface = {
      count: 2,
      results: [
        new EduContentSearchResultFixture({
          eduContent: new EduContentFixture({ id: 1 })
        }),
        new EduContentSearchResultFixture({
          eduContent: new EduContentFixture({ id: 2 })
        })
      ],
      filterCriteriaPredictions: new Map()
    };

    beforeEach(() => {
      loadInStore();

      jest
        .spyOn(eduContentService, 'search')
        .mockReturnValue(of(mockSearchResult));

      navigateWithParams({});
    });

    it('should call the eduContentService with the correct parameters', () => {
      const searchState = {
        searchTerm: '',
        filterCriteriaSelections: new Map([['foo', [1, 2, 3]]])
      } as SearchStateInterface;

      globalSearchViewModel.searchResults$.pipe(take(1)).subscribe();

      globalSearchViewModel.updateState(searchState);

      const expectedSearchState = {
        searchTerm: '',
        filterCriteriaSelections: new Map([['foo', [1, 2, 3]]])
      };

      expect(eduContentService.search).toHaveBeenCalled();
      expect(eduContentService.search).toHaveBeenCalledTimes(1);
      expect(eduContentService.search).toHaveBeenCalledWith(
        expectedSearchState
      );
    });

    it('should return the found results', () => {
      const searchState = {
        searchTerm: '',
        filterCriteriaSelections: new Map([])
      } as SearchStateInterface;

      const searchResults$ = globalSearchViewModel.searchResults$;
      const expected = {
        ...mockSearchResult,
        results: mockSearchResult.results.map(result => ({
          eduContent: result
        }))
      };

      globalSearchViewModel.updateState(searchState);

      expect(searchResults$).toBeObservable(hot('a', { a: expected }));
    });
  });

  describe('requestAutoComplete', () => {
    it('should call getInitialSearchState', () => {
      const getInitialSearchStateSpy = jest.spyOn(
        globalSearchViewModel,
        'getInitialSearchState'
      );
      globalSearchViewModel.requestAutoComplete('some string');
      expect(getInitialSearchStateSpy).toHaveBeenCalledTimes(1);
    });

    it('should call the eduContentService.autoComplete with the correct parameters and return a string[] observable', () => {
      navigateWithParams({});

      const getAutoCompleteSpy = jest
        .spyOn(eduContentService, 'autoComplete')
        .mockReturnValue(of(mockAutoCompleteReturnValue));

      expect(
        globalSearchViewModel.requestAutoComplete('some string')
      ).toBeObservable(hot('a', { a: mockAutoCompleteReturnValue }));
      expect(getAutoCompleteSpy).toHaveBeenCalledTimes(1);
      expect(getAutoCompleteSpy).toHaveBeenCalledWith({
        searchTerm: 'some string',
        filterCriteriaSelections: new Map<string, (number | string)[]>([])
      });
    });
  });

  describe('open eduContent', () => {
    it('should open a boek-e', () => {
      const eduContent = new EduContentFixture({
        id: 4
      });
      const spy = jest.spyOn(openStaticContentService, 'open');

      globalSearchViewModel.openBoeke(eduContent);

      expect(spy).toHaveBeenCalledWith(eduContent);
    });

    it('should open eduContent as a download', () => {
      const eduContent = new EduContentFixture({
        id: 4
      });
      const spy = jest.spyOn(openStaticContentService, 'open');

      globalSearchViewModel.openEduContentAsDownload(eduContent);

      expect(spy).toHaveBeenCalledWith(eduContent, false);
    });

    it('should open eduContent as a stream', () => {
      const eduContent = new EduContentFixture({
        id: 4
      });
      const spy = jest.spyOn(openStaticContentService, 'open');

      globalSearchViewModel.openEduContentAsStream(eduContent);

      expect(spy).toHaveBeenCalledWith(eduContent, true);
    });

    it('should open an exercise', () => {
      const eduContent = new EduContentFixture({
        id: 4
      });
      const spy = jest.spyOn(
        scormExerciseService,
        'previewExerciseFromUnlockedContent'
      );

      globalSearchViewModel.openEduContentAsExercise(eduContent);

      expect(spy).toHaveBeenCalledWith(null, eduContent.id, null, false);
    });

    it('should open an exercise with solutions', () => {
      const eduContent = new EduContentFixture({
        id: 4
      });
      const spy = jest.spyOn(
        scormExerciseService,
        'previewExerciseFromUnlockedContent'
      );

      globalSearchViewModel.openEduContentAsSolution(eduContent);

      expect(spy).toHaveBeenCalledWith(null, eduContent.id, null, true);
    });
  });

  function loadInStore() {}

  function navigateWithParams(params: {
    book?: number;
    chapter?: number;
    lesson?: number;
  }) {
    zone.run(() => {
      const navigationAction = {
        type: ROUTER_NAVIGATION,
        payload: {
          routerState: { params },
          event: {}
        } as RouterNavigationPayload<any>
      } as RouterNavigationAction;
      store.dispatch(navigationAction);
    });
  }
});
