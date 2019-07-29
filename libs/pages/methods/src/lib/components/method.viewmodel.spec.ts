import { Component, NgZone } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AUTH_SERVICE_TOKEN,
  CustomSerializer,
  DalState,
  EduContent,
  EduContentActions,
  EduContentBookActions,
  EduContentBookFixture,
  EduContentBookInterface,
  EduContentBookReducer,
  EduContentFixture,
  EduContentReducer,
  EduContentServiceInterface,
  EduContentTocActions,
  EduContentTOCFixture,
  EduContentTocReducer,
  EDU_CONTENT_SERVICE_TOKEN,
  getStoreModuleForFeatures,
  MethodActions,
  MethodFixture,
  MethodInterface,
  MethodReducer,
  UserReducer,
  YearFixture
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
import { MethodViewModel } from './method.viewmodel';

describe('MethodViewModel', () => {
  let methodViewModel: MethodViewModel;
  let store: Store<DalState>;
  let router: Router;
  let zone: NgZone;
  let openStaticContentService: OpenStaticContentServiceInterface;
  let scormExerciseService: ScormExerciseServiceInterface;
  let searchModes: EnvironmentSearchModesInterface;
  let eduContentService: EduContentServiceInterface;

  const bookId = 5;
  const diaboloBookId = 6;
  const bookMethodId = 1;
  const methodLearningAreaId = 42;

  //First two lessons are in chapter 1, last lesson is in chapter 2
  const chapterTocs = [
    new EduContentTOCFixture({
      id: 1,
      treeId: bookId,
      depth: 0,
      lft: 1,
      rgt: 6
    }),
    new EduContentTOCFixture({
      id: 2,
      treeId: bookId,
      depth: 0,
      lft: 7,
      rgt: 10
    })
  ];

  const lessonTocs = [
    new EduContentTOCFixture({
      id: 3,
      treeId: bookId,
      depth: 1,
      lft: 2,
      rgt: 3
    }),
    new EduContentTOCFixture({
      id: 4,
      treeId: bookId,
      depth: 1,
      lft: 4,
      rgt: 5
    }),
    new EduContentTOCFixture({
      id: 5,
      treeId: bookId,
      depth: 1,
      lft: 8,
      rgt: 9
    })
  ];

  const bookYears = [new YearFixture()];

  const book: EduContentBookInterface = new EduContentBookFixture({
    id: bookId,
    methodId: bookMethodId,
    eduContentTOC: [...chapterTocs, ...lessonTocs],
    years: bookYears
  });

  const diaboloBook: EduContentBookInterface = new EduContentBookFixture({
    id: diaboloBookId,
    diabolo: true
  });

  const method: MethodInterface = new MethodFixture({
    id: bookMethodId,
    learningAreaId: methodLearningAreaId
  });

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

  const generalFiles: EduContent[] = [
    new EduContentFixture({ id: 1 }, { eduContentProductTypeId: 1 }),
    new EduContentFixture({ id: 2 }, { eduContentProductTypeId: 2 }),
    new EduContentFixture({ id: 3 }, { eduContentProductTypeId: 2 })
  ];

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
            getGeneralEduContentForBookId: () => of(generalFiles),
            search: () => {},
            autoComplete: () => {}
          }
        },
        {
          provide: ENVIRONMENT_SEARCHMODES_TOKEN,
          useValue: {
            demo: createMockSearchMode({ name: 'demo' }),
            'chapter-lesson': createMockSearchMode({ name: 'chapter-lesson' }),
            'diabolo-chapter-lesson': createMockSearchMode({
              name: 'diabolo-chapter-lesson'
            })
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
    methodViewModel = TestBed.get(MethodViewModel);
    store = TestBed.get(Store);
    zone = TestBed.get(NgZone);
    router = TestBed.get(Router);
    loadInStore();
    openStaticContentService = TestBed.get(OPEN_STATIC_CONTENT_SERVICE_TOKEN);
    scormExerciseService = TestBed.get(SCORM_EXERCISE_SERVICE_TOKEN);
    eduContentService = TestBed.get(EDU_CONTENT_SERVICE_TOKEN);
    searchModes = TestBed.get(ENVIRONMENT_SEARCHMODES_TOKEN);
  });

  function loadInStore() {
    store.dispatch(
      new MethodActions.MethodsLoaded({
        methods: [method]
      })
    );

    store.dispatch(
      new EduContentBookActions.EduContentBooksLoaded({
        eduContentBooks: [book, diaboloBook]
      })
    );

    store.dispatch(
      new EduContentTocActions.AddEduContentTocsForBook({
        bookId: book.id,
        eduContentTocs: book.eduContentTOC
      })
    );
  }

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

  describe('creation', () => {
    it('should be defined', () => {
      expect(methodViewModel).toBeDefined();
    });
  });

  describe('getSearchMode', () => {
    it('should return the requested search mode', () => {
      navigateWithParams({ book: diaboloBook.id });

      expect(methodViewModel.getSearchMode('demo')).toBeObservable(
        hot('a', {
          a: searchModes['demo']
        })
      );
    });

    it('should return diabolo-chapter-lesson when on diabolo book and requesting chapter-lesson', () => {
      navigateWithParams({ book: diaboloBook.id });

      expect(methodViewModel.getSearchMode('chapter-lesson')).toBeObservable(
        hot('a', {
          a: searchModes['diabolo-chapter-lesson']
        })
      );
    });
  });

  describe('initialState', () => {
    const testcases = [
      {
        description: 'should return the correct searchState, only book',
        setup: {
          params: {
            book: bookId
          }
        },
        expected: {
          selections: [
            ['year', bookYears.map(years => years.id)],
            ['method', [bookMethodId]],
            ['learningArea', [methodLearningAreaId]]
          ] as any[]
        }
      },
      {
        description:
          'should return the correct searchState, only book and chapter',
        setup: {
          params: {
            book: bookId,
            chapter: 3
          }
        },
        expected: {
          selections: [
            ['year', bookYears.map(years => years.id)],
            ['method', [bookMethodId]],
            ['learningArea', [methodLearningAreaId]],
            ['eduContentTOC', [3]]
          ] as any[]
        }
      },
      {
        description:
          'should return the correct searchState, book, chapter and lesson',
        setup: {
          params: {
            book: bookId,
            chapter: 3,
            lesson: 4
          }
        },
        expected: {
          selections: [
            ['year', bookYears.map(years => years.id)],
            ['method', [bookMethodId]],
            ['learningArea', [methodLearningAreaId]],
            ['eduContentTOC', [4]]
          ] as any[]
        }
      }
    ];

    beforeEach(() => {
      loadInStore();
    });

    testcases.forEach(testcase =>
      it(testcase.description, () => {
        navigateWithParams(testcase.setup.params);

        const initialSearchState$ = methodViewModel.getInitialSearchState();
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

      methodViewModel.updateState(mockSearchState);
      expect(methodViewModel.searchState$).toBeObservable(
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

      eduContentService.search = jest
        .fn()
        .mockReturnValue(of(mockSearchResult));

      navigateWithParams({ book: bookId });
    });

    it('should call the eduContentService with the correct parameters', () => {
      const searchState = {
        searchTerm: '',
        filterCriteriaSelections: new Map([['foo', [1, 2, 3]]])
      } as SearchStateInterface;

      methodViewModel.searchResults$.pipe(take(1)).subscribe();

      methodViewModel.updateState(searchState);

      const expectedSearchState = {
        searchTerm: '',
        filterCriteriaSelections: new Map([
          ['foo', [1, 2, 3]],
          // from the initialSearchState
          ['year', bookYears.map(years => years.id)],
          ['method', [bookMethodId]],
          ['learningArea', [methodLearningAreaId]]
        ])
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

      const searchResults$ = methodViewModel.searchResults$;
      const expected = {
        ...mockSearchResult,
        results: mockSearchResult.results.map(result => ({
          eduContent: result
        }))
      };

      methodViewModel.updateState(searchState);

      expect(searchResults$).toBeObservable(hot('a', { a: expected }));
    });
  });

  describe('requestAutoComplete', () => {
    it('should call getInitialSearchState', () => {
      const getInitialSearchStateSpy = jest.spyOn(
        methodViewModel,
        'getInitialSearchState'
      );
      methodViewModel.requestAutoComplete('some string');
      expect(getInitialSearchStateSpy).toHaveBeenCalledTimes(1);
    });

    it('should call the eduContentService.autoComplete with the correct parameters and return a string[] observable', () => {
      navigateWithParams({});

      const getAutoCompleteSpy = jest
        .spyOn(eduContentService, 'autoComplete')
        .mockReturnValue(of(mockAutoCompleteReturnValue));

      expect(methodViewModel.requestAutoComplete('some string')).toBeObservable(
        hot('a', { a: mockAutoCompleteReturnValue })
      );
      expect(getAutoCompleteSpy).toHaveBeenCalledTimes(1);
      expect(getAutoCompleteSpy).toHaveBeenCalledWith({
        searchTerm: 'some string',
        filterCriteriaSelections: new Map<string, (number | string)[]>([])
      });
    });
  });

  describe('presentation streams', () => {
    describe('currentMethod$', () => {
      it('should return the method for the current book', () => {
        navigateWithParams({ book: book.id });

        expect(methodViewModel.currentMethod$).toBeObservable(
          hot('a', {
            a: method
          })
        );
      });

      it('should return null as method if no book is selected', () => {
        navigateWithParams({});

        expect(methodViewModel.currentMethod$).toBeObservable(
          hot('a', {
            a: null
          })
        );
      });
    });

    describe('currentToc$', () => {
      it('should be an empty array when no book, chapter or lesson is selected', () => {
        navigateWithParams({});

        expect(methodViewModel.currentToc$).toBeObservable(
          hot('a', {
            a: []
          })
        );
      });

      it('should return chapter tocs when book is selected', () => {
        navigateWithParams({ book: book.id });

        expect(methodViewModel.currentToc$).toBeObservable(
          hot('a', {
            a: chapterTocs
          })
        );
      });

      it('should return lesson tocs when chapter is selected', () => {
        navigateWithParams({ book: book.id, chapter: 1 });

        expect(methodViewModel.currentToc$).toBeObservable(
          hot('a', {
            a: [lessonTocs[0], lessonTocs[1]]
          })
        );
      });

      it('should return lesson tocs when lesson is selected', () => {
        navigateWithParams({ book: book.id, chapter: 1, lesson: 1 });

        expect(methodViewModel.currentToc$).toBeObservable(
          hot('a', {
            a: [lessonTocs[0], lessonTocs[1]]
          })
        );
      });
    });

    describe('generalFilesByType$', () => {
      it('should return the eduContent in generalFiles$ grouped by productTypeId', () => {
        navigateWithParams({ book: book.id });

        expect(methodViewModel.generalFilesByType$).toBeObservable(
          hot('a', {
            a: {
              1: [generalFiles[0]],
              2: [generalFiles[1], generalFiles[2]]
            }
          })
        );
      });
    });

    describe('currentBoeke$', () => {
      const mockBoeke = new EduContentFixture(
        { type: 'boek-e' },
        { eduContentBookId: bookId }
      );

      beforeEach(() => {
        loadInStore();
        store.dispatch(
          new EduContentActions.EduContentsLoaded({ eduContents: [mockBoeke] })
        );
      });

      it('should emit the boek-e for the currently selected book', () => {
        navigateWithParams({ book: bookId });

        const expected = mockBoeke;
        expect(methodViewModel.currentBoeke$).toBeObservable(
          hot('a', { a: expected })
        );
      });
    });
  });

  describe('open eduContent', () => {
    it('should open a boek-e', () => {
      const eduContent = new EduContentFixture({
        id: 4
      });
      const spy = jest.spyOn(openStaticContentService, 'open');

      methodViewModel.openBoeke(eduContent);

      expect(spy).toHaveBeenCalledWith(eduContent);
    });

    it('should open eduContent as a download', () => {
      const eduContent = new EduContentFixture({
        id: 4
      });
      const spy = jest.spyOn(openStaticContentService, 'open');

      methodViewModel.openEduContentAsDownload(eduContent);

      expect(spy).toHaveBeenCalledWith(eduContent, false);
    });

    it('should open eduContent as a stream', () => {
      const eduContent = new EduContentFixture({
        id: 4
      });
      const spy = jest.spyOn(openStaticContentService, 'open');

      methodViewModel.openEduContentAsStream(eduContent);

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

      methodViewModel.openEduContentAsExercise(eduContent);

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

      methodViewModel.openEduContentAsSolution(eduContent);

      expect(spy).toHaveBeenCalledWith(null, eduContent.id, null, true);
    });
  });
});
