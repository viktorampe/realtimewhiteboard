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
  EduContentBookFixture,
  EduContentBookQueries,
  EduContentTOCFixture,
  EduContentTocQueries,
  getStoreModuleForFeatures,
  MethodQueries,
  UnlockedFreePracticeActions,
  UnlockedFreePracticeFixture,
  UnlockedFreePracticeInterface,
  UnlockedFreePracticeQueries
} from '@campus/dal';
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
import { CurrentPracticeParams, PracticeViewModel } from './practice.viewmodel';

describe('PracticeViewModel', () => {
  let practiceViewModel: PracticeViewModel;
  let store: Store<DalState>;
  let router: Router;
  let zone: NgZone;
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

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({ router: routerReducer }),
        ...getStoreModuleForFeatures([]),
        RouterTestingModule.withRoutes([]),
        StoreRouterConnectingModule.forRoot({
          navigationActionTiming: NavigationActionTiming.PostActivation,
          serializer: CustomSerializer
        })
      ],
      providers: [
        Store,
        { provide: RouterStateSerializer, useClass: CustomSerializer },
        { provide: AUTH_SERVICE_TOKEN, useValue: { userId } }
      ]
    });
  });

  beforeEach(() => {
    setupSelectorSpies();

    practiceViewModel = TestBed.get(PracticeViewModel);
    store = TestBed.get(Store);
    router = TestBed.get(Router);
    zone = TestBed.get(NgZone);
  });

  function setupSelectorSpies() {
    selectorSpies = {
      //Used by currentBook$
      book: jest.spyOn(EduContentBookQueries, 'getById'),
      //Used by filteredClassgroups$
      classGroups: jest.spyOn(ClassGroupQueries, 'getByMethodId'),
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

        expect(ClassGroupQueries.getByMethodId).toHaveBeenCalledWith(
          storeState,
          { id: methodId }
        );
      });
    });
  });

  describe('toggleUnlockedFreePractice()', () => {
    const unlockedFreePractices: UnlockedFreePracticeInterface[] = [
      new UnlockedFreePracticeFixture(),
      new UnlockedFreePracticeFixture(),
      new UnlockedFreePracticeFixture()
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
      practiceViewModel.toggleUnlockedFreePractice(
        unlockedFreePractices,
        false
      );
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(
        new UnlockedFreePracticeActions.DeleteUnlockedFreePractices({
          userId,
          ids: unlockedFreePractices.map(ufp => ufp.id)
        })
      );
    });
  });

  function navigateWithParams(params: { book?: number }) {
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
