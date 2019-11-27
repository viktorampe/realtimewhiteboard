import { NgZone } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AUTH_SERVICE_TOKEN,
  ClassGroupFixture,
  ClassGroupQueries,
  CustomSerializer,
  DalState,
  EduContentBookActions,
  EduContentBookFixture,
  EduContentBookInterface,
  EduContentBookQueries,
  EduContentBookReducer,
  EduContentFixture,
  EduContentReducer,
  EduContentServiceInterface,
  EduContentTocActions,
  EduContentTOCFixture,
  EduContentTocQueries,
  EduContentTocReducer,
  EDU_CONTENT_SERVICE_TOKEN,
  getStoreModuleForFeatures,
  MethodActions,
  MethodFixture,
  MethodInterface,
  MethodLevelReducer,
  MethodQueries,
  MethodReducer,
  ResultReducer,
  UnlockedFreePracticeActions,
  UnlockedFreePracticeFixture,
  UnlockedFreePracticeInterface,
  UnlockedFreePracticeQueries,
  UserReducer,
  YearActions,
  YearFixture,
  YearReducer
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
import { CurrentPracticeParams, PracticeViewModel } from './practice.viewmodel';

describe('PracticeViewModel', () => {
  let practiceViewModel: PracticeViewModel;
  let store: Store<DalState>;
  let router: Router;
  let zone: NgZone;
  let openStaticContentService: OpenStaticContentServiceInterface;
  let scormExerciseService: ScormExerciseServiceInterface;
  let searchModes: EnvironmentSearchModesInterface;
  let eduContentService: EduContentServiceInterface;

  let selectorSpies: {
    book: jest.SpyInstance;
    classGroups: jest.SpyInstance;
    bookChapters: jest.SpyInstance;
    ufpByEduContentTOCId: jest.SpyInstance;
    ufpByEduContentBookId: jest.SpyInstance;
    methodWithYearByBookId: jest.SpyInstance;
  };

  const userId = 1;
  const storeState = jasmine.anything();

  const bookId = 5;
  const diaboloBookId = 6;
  const bookMethodId = 1;
  const methodLearningAreaId = 42;

  //First two lessons are in chapter 1, last lesson is in chapter 2
  const chapterTocs = [
    new EduContentTOCFixture({
      id: 1,
      treeId: bookId,
      title: 'Chapter 1',
      depth: 0,
      lft: 1,
      rgt: 6,
      learningPlanGoalIds: [1, 2, 3]
    }),
    new EduContentTOCFixture({
      id: 2,
      treeId: bookId,
      title: 'Chapter 2',
      depth: 0,
      lft: 7,
      rgt: 10,
      learningPlanGoalIds: [1, 2, 3, 4]
    })
  ];

  const lessonTocs = [
    new EduContentTOCFixture({
      id: 3,
      treeId: bookId,
      title: 'Lesson 1',
      depth: 1,
      lft: 2,
      rgt: 3,
      learningPlanGoalIds: [1, 2]
    }),
    new EduContentTOCFixture({
      id: 4,
      treeId: bookId,
      title: 'Lesson 2',
      depth: 1,
      lft: 4,
      rgt: 5,
      learningPlanGoalIds: [2, 3, 4]
    }),
    new EduContentTOCFixture({
      id: 5,
      treeId: bookId,
      title: 'Lesson 3',
      depth: 1,
      lft: 8,
      rgt: 9,
      learningPlanGoalIds: [1, 2, 3]
    })
  ];

  const bookYears = [new YearFixture({ label: '1e leerjaar' })];

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
    name: 'Katapult',
    learningAreaId: methodLearningAreaId
  });

  function createMockSearchMode(overrides: Partial<SearchModeInterface>) {
    return Object.assign(
      {
        name: 'demo',
        label: 'demo',
        dynamicFilters: false,
        searchFilterFactory: FilterFactoryFixture,
        searchTerm: null,
        results: {
          component: null,
          sortModes: [],
          pageSize: 3
        }
      },
      overrides
    ) as SearchModeInterface;
  }

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({ router: routerReducer }),
        ...getStoreModuleForFeatures([
          UserReducer,
          EduContentTocReducer,
          EduContentBookReducer,
          MethodReducer,
          YearReducer,
          EduContentReducer,
          MethodLevelReducer,
          ResultReducer
        ]),
        RouterTestingModule.withRoutes([]),
        StoreRouterConnectingModule.forRoot({
          navigationActionTiming: NavigationActionTiming.PostActivation,
          serializer: CustomSerializer
        })
      ],
      providers: [
        Store,
        { provide: RouterStateSerializer, useClass: CustomSerializer },
        { provide: AUTH_SERVICE_TOKEN, useValue: { userId } },
        {
          provide: EDU_CONTENT_SERVICE_TOKEN,
          useValue: {
            search: () => {}
          }
        },
        {
          provide: ENVIRONMENT_SEARCHMODES_TOKEN,
          useValue: {
            demo: createMockSearchMode({ name: 'demo' }),
            'practice-chapter-lesson': createMockSearchMode({
              name: 'practice-chapter-lesson'
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

  function loadInStore() {
    store.dispatch(
      new MethodActions.MethodsLoaded({
        methods: [method]
      })
    );

    store.dispatch(
      new YearActions.YearsLoaded({
        years: bookYears
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

  beforeEach(() => {
    setupSelectorSpies();

    practiceViewModel = TestBed.get(PracticeViewModel);
    store = TestBed.get(Store);
    router = TestBed.get(Router);
    zone = TestBed.get(NgZone);

    openStaticContentService = TestBed.get(OPEN_STATIC_CONTENT_SERVICE_TOKEN);
    scormExerciseService = TestBed.get(SCORM_EXERCISE_SERVICE_TOKEN);
    eduContentService = TestBed.get(EDU_CONTENT_SERVICE_TOKEN);
    searchModes = TestBed.get(ENVIRONMENT_SEARCHMODES_TOKEN);
  });

  function setupSelectorSpies() {
    selectorSpies = {
      //Used by currentBook$
      book: jest.spyOn(EduContentBookQueries, 'getById'),
      //Used by filteredClassgroups$
      classGroups: jest.spyOn(ClassGroupQueries, 'getClassGroupsForBook'),
      //Used by bookChapters$
      bookChapters: jest.spyOn(EduContentTocQueries, 'getChaptersForBook'),
      //Used by unlockedFreePracticeByEduContentTOCId$
      ufpByEduContentTOCId: jest.spyOn(
        UnlockedFreePracticeQueries,
        'getGroupedByEduContentTOCId'
      ),
      ufpByEduContentBookId: jest.spyOn(
        UnlockedFreePracticeQueries,
        'getGroupedByEduContentBookId'
      ),
      methodWithYearByBookId: jest.spyOn(
        MethodQueries,
        'getMethodWithYearByBookId'
      )
    };
  }

  describe('creation', () => {
    it('should be defined', () => {
      expect(practiceViewModel).toBeDefined();
    });
  });

  describe('search', () => {
    describe('getSearchMode', () => {
      it('should return the requested search mode', () => {
        navigateWithParams({ book: bookId });

        expect(practiceViewModel.getSearchMode('demo')).toBeObservable(
          hot('(a|)', { a: searchModes['demo'] })
        );
      });
    });

    describe('initialState', () => {
      beforeEach(() => {
        loadInStore();
      });

      const testCases = [
        {
          it: 'should return the correct searchState, only book and chapter',
          setup: {
            params: { book: bookId, chapter: chapterTocs[0].id }
          },
          expected: {
            selections: new Map<string, number[]>([
              ['methods', [bookMethodId]],
              ['eduContentTOC', [chapterTocs[0].id]]
            ])
          }
        },
        {
          it: 'should return the correct searchState, book, chapter and lesson',
          setup: {
            params: {
              book: bookId,
              chapter: chapterTocs[0].id,
              lesson: lessonTocs[0].id
            }
          },
          expected: {
            selections: new Map<string, number[]>([
              ['methods', [bookMethodId]],
              ['eduContentTOC', [lessonTocs[0].id]]
            ])
          }
        }
      ];

      testCases.forEach(testcase => {
        it(testcase.it, () => {
          navigateWithParams(testcase.setup.params);

          const initialSearchState$ = practiceViewModel.getInitialSearchState();
          const expected: SearchStateInterface = {
            searchTerm: null,
            filterCriteriaSelections: testcase.expected.selections
          };

          expect(initialSearchState$).toBeObservable(hot('a', { a: expected }));
        });
      });
    });

    describe('updateState', () => {
      it('should emit the value in the searchState$', () => {
        const mockSearchState = {} as SearchStateInterface;

        practiceViewModel.updateState(mockSearchState);
        expect(practiceViewModel.searchState$).toBeObservable(
          hot('a', { a: mockSearchState })
        );
      });
    });

    describe('searchResults', () => {
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

        navigateWithParams({ book: bookId, chapter: 3 });
      });

      it('should call the eduContentService with the correct parameters, ', () => {
        const searchState = {
          searchTerm: null,
          filterCriteriaSelections: new Map([['methodLevel', [1]]])
        } as SearchStateInterface;

        practiceViewModel.searchResults$.pipe(take(1)).subscribe();
        practiceViewModel.updateState(searchState);

        const expectedSearchState = {
          searchTerm: null,
          filterCriteriaSelections: new Map([
            ['methodLevel', [1]],
            ['methods', [bookMethodId]],
            ['eduContentTOC', [lessonTocs[0].id]]
          ])
        };

        expect(eduContentService.search).toHaveBeenCalledTimes(1);
        expect(eduContentService.search).toHaveBeenCalledWith(
          expectedSearchState
        );
      });

      it('should return the found results', () => {
        const searchState = {
          searchTerm: null,
          filterCriteriaSelections: new Map([])
        } as SearchStateInterface;

        const searchResults$ = practiceViewModel.searchResults$;
        const expected = {
          ...mockSearchResult,
          results: mockSearchResult.results.map(result => ({
            eduContent: result
          }))
        };

        practiceViewModel.updateState(searchState);

        expect(searchResults$).toBeObservable(hot('a', { a: expected }));
      });
    });
  });

  describe('presentation streams', () => {
    describe('currentPracticeParams$', () => {
      it('should contain the current bookId from the route', () => {
        navigateWithParams({ book: 1 });

        expect(practiceViewModel.currentPracticeParams$).toBeObservable(
          hot('a', {
            a: {
              book: 1
            } as CurrentPracticeParams
          })
        );
      });
    });

    describe('bookTitle$', () => {
      const mockBookTitle = 'Kompas 1';

      beforeEach(() => {
        selectorSpies.methodWithYearByBookId.mockReturnValue(mockBookTitle);
      });

      it('should be null if not in a book', () => {
        navigateWithParams({});

        expect(practiceViewModel.bookTitle$).toBeObservable(
          hot('a', {
            a: null
          })
        );
      });

      it('should return the book title if in a book', () => {
        navigateWithParams({ book: 1 });

        expect(practiceViewModel.bookTitle$).toBeObservable(
          hot('a', {
            a: mockBookTitle
          })
        );

        expect(MethodQueries.getMethodWithYearByBookId).toHaveBeenCalledWith(
          storeState,
          { id: 1 }
        );
      });
    });

    describe('bookChapters$', () => {
      const bookChapters = [
        new EduContentTOCFixture({ id: 1 }),
        new EduContentTOCFixture({ id: 2 }),
        new EduContentTOCFixture({ id: 3 })
      ];

      beforeEach(() => {
        selectorSpies.bookChapters.mockReturnValue(bookChapters);
      });

      it('should be an empty array if not in a book', () => {
        navigateWithParams({});

        expect(practiceViewModel.bookChapters$).toBeObservable(
          hot('a', {
            a: []
          })
        );
      });

      it('should be the chapters of the book if in a book', () => {
        navigateWithParams({ book: 1 });

        expect(practiceViewModel.bookChapters$).toBeObservable(
          hot('a', {
            a: bookChapters
          })
        );

        expect(EduContentTocQueries.getChaptersForBook).toHaveBeenCalledWith(
          storeState,
          { bookId: 1 }
        );
      });
    });

    describe('filteredClassGroups$', () => {
      const methodId = 5;
      const mockBook = new EduContentBookFixture({ id: 1, methodId });
      const mockClassGroups = [
        new ClassGroupFixture({ id: 1 }),
        new ClassGroupFixture({ id: 2 })
      ];

      beforeEach(() => {
        selectorSpies.book.mockReturnValue(mockBook);
        selectorSpies.classGroups.mockReturnValue(mockClassGroups);
      });

      it('should return the classGroups matching the current book method', () => {
        navigateWithParams({ book: 1 });

        expect(practiceViewModel.filteredClassGroups$).toBeObservable(
          hot('a', {
            a: mockClassGroups
          })
        );

        expect(ClassGroupQueries.getClassGroupsForBook).toHaveBeenCalledWith(
          storeState,
          { id: mockBook.id, filterByYear: false }
        );
      });
    });
  });

  describe('toggleUnlockedFreePractice()', () => {
    const unlockedFreePractices: UnlockedFreePracticeInterface[] = [
      new UnlockedFreePracticeFixture({ id: 1 }),
      new UnlockedFreePracticeFixture({ id: 2 }),
      new UnlockedFreePracticeFixture({ id: 3 })
    ];

    it('should dispatch StartAddManyUnlockedFreePractices when checkbox is on', () => {
      const spy = jest.spyOn(store, 'dispatch');
      practiceViewModel.toggleUnlockedFreePractice(unlockedFreePractices, true);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(
        new UnlockedFreePracticeActions.StartAddManyUnlockedFreePractices({
          userId,
          unlockedFreePractices: unlockedFreePractices
        })
      );
    });
    it('should dispatch DeleteUnlockedFreePractices when checkbox is off', () => {
      const spy = jest.spyOn(store, 'dispatch');
      jest
        .spyOn(UnlockedFreePracticeQueries, 'findOne')
        .mockReturnValueOnce(unlockedFreePractices[0]) // id 1
        .mockReturnValueOnce(undefined) // mock that second ufp is not found in the store
        .mockReturnValueOnce(unlockedFreePractices[2]); // id 3

      practiceViewModel.toggleUnlockedFreePractice(
        unlockedFreePractices,
        false
      );

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(
        new UnlockedFreePracticeActions.DeleteUnlockedFreePractices({
          userId,
          ids: [unlockedFreePractices[0].id, unlockedFreePractices[2].id]
        })
      );
    });
  });

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
