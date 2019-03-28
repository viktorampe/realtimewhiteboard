import { Component } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AUTH_SERVICE_TOKEN,
  BundleActions,
  BundleFixture,
  BundleReducer,
  CustomSerializer,
  DalState,
  EduContentFixture,
  EduContentServiceInterface,
  EDU_CONTENT_SERVICE_TOKEN,
  FavoriteActions,
  FavoriteFixture,
  FavoriteReducer,
  FavoriteTypesEnum,
  getStoreModuleForFeatures,
  LearningAreaActions,
  LearningAreaFixture,
  LearningAreaInterface,
  LearningAreaReducer,
  TaskActions,
  TaskFixture,
  TaskReducer
} from '@campus/dal';
import {
  FilterFactoryFixture,
  SearchModeInterface,
  SearchResultInterface,
  SearchStateInterface
} from '@campus/search';
import {
  EduContentSearchResultFixture,
  ENVIRONMENT_SEARCHMODES_TOKEN
} from '@campus/shared';
import { MockDate } from '@campus/testing';
import { MapObjectConversionService } from '@campus/utils';
import {
  NavigationActionTiming,
  routerReducer,
  RouterStateSerializer,
  StoreRouterConnectingModule
} from '@ngrx/router-store';
import { Store, StoreModule } from '@ngrx/store';
import { cold, hot } from '@nrwl/nx/testing';
import { Observable, of } from 'rxjs';
import {
  EduContentsViewModel,
  RouterStateParamsInterface
} from './edu-contents.viewmodel';

describe('EduContentsViewModel', () => {
  let eduContentsViewModel: EduContentsViewModel;
  let eduContentService: EduContentServiceInterface;
  let router: Router;

  const mockSearchState: SearchStateInterface = {
    searchTerm: 'not this',
    filterCriteriaSelections: new Map<string, (number | string)[]>([
      ['thing', ['one', 'two']],
      ['other thing', ['three', 'four']]
    ])
  };
  const searchMode: SearchModeInterface = {
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
      sortModes: [
        {
          description: 'book',
          name: 'book',
          icon: 'book'
        },
        {
          description: 'bundle',
          name: 'bundle',
          icon: 'bundle'
        },
        {
          description: 'taak',
          name: 'taak',
          icon: 'taak'
        }
      ],
      pageSize: 3
    }
  };

  let store: Store<DalState>;

  const mockAutoCompleteReturnValue = ['strings', 'for', 'autocomplete'];
  const mockLearningAreas = [
    new LearningAreaFixture({ id: 1 }),
    new LearningAreaFixture({ id: 2 }),
    new LearningAreaFixture({ id: 3 })
  ];
  const mockFavorites = [
    new FavoriteFixture({ id: 1, learningAreaId: 2, type: 'area' }),
    new FavoriteFixture({ id: 2, learningAreaId: 3, type: 'area' }),
    new FavoriteFixture({ id: 3, eduContentId: 1, type: 'educontent' }),
    new FavoriteFixture({ id: 4, eduContentId: 2, type: 'educontent' })
  ];
  const mockBundles = [
    new BundleFixture({ id: 1 }),
    new BundleFixture({ id: 2 }),
    new BundleFixture({ id: 3 })
  ];
  const mockTasks = [
    new TaskFixture({ id: 1 }),
    new TaskFixture({ id: 2 }),
    new TaskFixture({ id: 3 })
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          {
            path: '',
            redirectTo: 'edu-content',
            pathMatch: 'full'
          },
          {
            path: 'edu-content',
            component: Component,
            children: [
              {
                path: ':area',
                component: Component
              }
            ]
          }
        ]),
        StoreModule.forRoot({ router: routerReducer }),
        ...getStoreModuleForFeatures([
          FavoriteReducer,
          LearningAreaReducer,
          BundleReducer,
          TaskReducer
        ]),
        StoreRouterConnectingModule.forRoot({
          navigationActionTiming: NavigationActionTiming.PostActivation,
          serializer: CustomSerializer
        })
      ],
      providers: [
        EduContentsViewModel,
        Store,
        MapObjectConversionService,
        { provide: RouterStateSerializer, useClass: CustomSerializer },
        { provide: AUTH_SERVICE_TOKEN, useValue: { userId: 1 } },
        {
          provide: EDU_CONTENT_SERVICE_TOKEN,
          useValue: {
            autoComplete: (state: SearchStateInterface) => {
              return of(mockAutoCompleteReturnValue);
            }
          }
        },
        {
          provide: ENVIRONMENT_SEARCHMODES_TOKEN,
          useValue: {
            demo: searchMode
          }
        }
      ]
    });
    eduContentsViewModel = TestBed.get(EduContentsViewModel);
    eduContentService = TestBed.get(EDU_CONTENT_SERVICE_TOKEN);
    router = TestBed.get(Router);
    store = TestBed.get(Store);

    router.initialNavigation();
    store.dispatch(
      new LearningAreaActions.LearningAreasLoaded({
        learningAreas: mockLearningAreas
      })
    );
    store.dispatch(
      new FavoriteActions.FavoritesLoaded({ favorites: mockFavorites })
    );

    store.dispatch(new BundleActions.BundlesLoaded({ bundles: mockBundles }));

    store.dispatch(new TaskActions.TasksLoaded({ tasks: mockTasks }));
  });

  it('should be defined', () => {
    expect(eduContentsViewModel).toBeDefined();
  });

  describe('toggle favorites', () => {
    let mockDate: MockDate;
    let spyFavAction;

    beforeAll(() => {
      mockDate = new MockDate();
    });

    afterAll(() => {
      mockDate.returnRealDate();
    });

    it('toggleFavoriteArea should dispatch ToggleFavorite action', () => {
      spyFavAction = jest.spyOn(FavoriteActions, 'ToggleFavorite');
      const area: LearningAreaInterface = new LearningAreaFixture();

      eduContentsViewModel.toggleFavoriteArea(area);

      expect(FavoriteActions.ToggleFavorite).toHaveBeenCalledTimes(1);
      expect(FavoriteActions.ToggleFavorite).toHaveBeenCalledWith({
        favorite: {
          name: area.name,
          type: FavoriteTypesEnum.AREA,
          learningAreaId: area.id,
          created: mockDate.mockDate
        }
      });

      spyFavAction.mockClear();
    });

    it('saveSearchState should dispatch StartAddFavorite action', () => {
      spyFavAction = jest.spyOn(FavoriteActions, 'StartAddFavorite');
      const expectedFavoriteCriteria: string = JSON.stringify({
        searchTerm: 'foo',
        filterCriteriaSelections: {
          bar: [1, 2],
          baz: [5, 6]
        }
      });

      eduContentsViewModel.saveSearchState({
        searchTerm: 'foo',
        filterCriteriaSelections: new Map([['bar', [1, 2]], ['baz', [5, 6]]])
      });

      expect(FavoriteActions.StartAddFavorite).toHaveBeenCalledTimes(1);
      expect(FavoriteActions.StartAddFavorite).toHaveBeenCalledWith({
        favorite: {
          name: 'Zoekopdracht',
          type: FavoriteTypesEnum.SEARCH,
          criteria: expectedFavoriteCriteria,
          created: mockDate.mockDate
        },
        userId: 1
      });

      spyFavAction.mockClear();
    });
  });

  describe('requestAutoComplete', () => {
    it('should call autoComplete on the eduContentService', () => {
      const autoCompleteSpy = jest.spyOn(eduContentService, 'autoComplete');
      const mockNewSearchTerm = 'new search term';
      const results = eduContentsViewModel.requestAutoComplete(
        mockNewSearchTerm
      );
      results.subscribe(); // needed for observable to trigger

      const inititalSearchState = {
        searchTerm: '',
        filterCriteriaSelections: new Map()
      };

      expect(autoCompleteSpy).toHaveBeenCalledTimes(1);
      expect(autoCompleteSpy).toHaveBeenCalledWith({
        ...inititalSearchState,
        searchTerm: mockNewSearchTerm
      });
    });
  });

  describe('learningAreas$', () => {
    it('should return all the learningareas', () => {
      expect(eduContentsViewModel.learningAreas$).toBeObservable(
        hot('a', { a: mockLearningAreas })
      );
    });
    it('should return the learningarea for current route', fakeAsync(() => {
      router.navigate(['edu-content', '1']);
      tick();
      expect(eduContentsViewModel.learningArea$).toBeObservable(
        hot('a', {
          a: mockLearningAreas[0]
        })
      );
    }));
  });

  describe('favoriteLearningAreas$', () => {
    it('should return the favorite learningareas', () => {
      expect(eduContentsViewModel.favoriteLearningAreas$).toBeObservable(
        hot('a', {
          a: mockLearningAreas.filter(area => [2, 3].indexOf(area.id) !== -1)
        })
      );
    });
  });

  describe('eduContentFavorites$', () => {
    it('should return the eduContent favorites', () => {
      expect(eduContentsViewModel.eduContentFavorites$).toBeObservable(
        hot('a', {
          a: mockFavorites.filter(favorite => favorite.type === 'educontent')
        })
      );
    });
  });
  describe('getInitialSearchState', () => {
    it('should create the initialState with the correct params data', () => {
      const mockRouterParams$: Observable<RouterStateParamsInterface> = hot(
        'a-b-c-d',
        {
          a: {},
          b: { area: '3' },
          c: { area: '4', task: '894' },
          d: { task: '38948' }
        }
      );
      eduContentsViewModel['routerStateParams$'] = mockRouterParams$;
      expect(eduContentsViewModel.getInitialSearchState()).toBeObservable(
        hot('a-b-c-d', {
          a: {
            searchTerm: '',
            filterCriteriaSelections: new Map<string, (number | string)[]>([])
          },
          b: {
            searchTerm: '',
            filterCriteriaSelections: new Map<string, (number | string)[]>([
              ['learningArea', [3]]
            ])
          },
          c: {
            searchTerm: '',
            filterCriteriaSelections: new Map<string, (number | string)[]>([
              ['learningArea', [4]]
            ]),
            filterCriteriaOptions: new Map<string, number | string | boolean>([
              ['taskAllowed', true]
            ])
          },
          d: {
            searchTerm: '',
            filterCriteriaSelections: new Map<string, (number | string)[]>([]),
            filterCriteriaOptions: new Map<string, number | string | boolean>([
              ['taskAllowed', true]
            ])
          }
        })
      );
    });
  });
  describe('requestAutoComplete', () => {
    it('should call getInitialSearchState', () => {
      const getInitialSearchStateSpy = jest.spyOn(
        eduContentsViewModel,
        'getInitialSearchState'
      );
      eduContentsViewModel.requestAutoComplete('some string');
      expect(getInitialSearchStateSpy).toHaveBeenCalledTimes(1);
    });
    it('should call the eduContentService.autoComplete with the correct parameters and return a string[] observable', () => {
      const mockRouterParams$: Observable<RouterStateParamsInterface> = hot(
        'a',
        { a: {} }
      );
      eduContentsViewModel['routerStateParams$'] = mockRouterParams$;
      const getAutoCompleteSpy = jest.spyOn(eduContentService, 'autoComplete');
      expect(
        eduContentsViewModel.requestAutoComplete('some string')
      ).toBeObservable(hot('a', { a: mockAutoCompleteReturnValue }));
      expect(getAutoCompleteSpy).toHaveBeenCalledTimes(1);
      expect(getAutoCompleteSpy).toHaveBeenCalledWith({
        searchTerm: 'some string',
        filterCriteriaSelections: new Map<string, (number | string)[]>([])
      });
    });
  });

  describe('this.searchResults$', () => {
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
      eduContentService.search = jest
        .fn()
        .mockReturnValue(of(mockSearchResult));
    });

    describe('searchState selection contains taskId', () => {
      const mockSearchStateTask: SearchStateInterface = {
        searchTerm: '',
        filterCriteriaSelections: new Map([['task', [1]]])
      };

      beforeEach(() => {
        eduContentsViewModel.updateState(mockSearchStateTask);
      });

      it('should set currentTask, inTask = true and inBundle = false', () => {
        const expected = mockSearchResult.results.map(result => ({
          ...result,
          currentTask: mockTasks[0],
          inTask: true,
          inBundle: false
        }));

        expect(eduContentsViewModel.searchResults$).toBeObservable(
          cold('a', { a: expected })
        );
      });
    });

    describe('searchState selection contains bundleId', () => {
      const mockSearchStateBundle: SearchStateInterface = {
        searchTerm: '',
        filterCriteriaSelections: new Map([['bundle', [1]]])
      };

      beforeEach(() => {
        eduContentsViewModel.updateState(mockSearchStateBundle);
      });

      it('should set currentBundle, inBundle = true and inTask = false', () => {
        const expected = mockSearchResult.results.map(result => ({
          ...result,
          currentBundle: mockBundles[0],
          inTask: false,
          inBundle: true
        }));

        expect(eduContentsViewModel.searchResults$).toBeObservable(
          cold('a', { a: expected })
        );
      });
    });
  });

  describe('getSearchMode', () => {
    it('should return the correct searchmode', () => {
      expect(eduContentsViewModel.getSearchMode('demo')).toEqual(searchMode);
      expect(eduContentsViewModel.getSearchMode('foo')).toBeUndefined();
    });
  });
});
