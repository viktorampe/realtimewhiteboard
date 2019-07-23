import { Component, NgZone } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AUTH_SERVICE_TOKEN,
  CustomSerializer,
  DalState,
  EduContentBookActions,
  EduContentBookFixture,
  EduContentBookInterface,
  EduContentBookReducer,
  EduContentTocActions,
  EduContentTOCFixture,
  EduContentTocReducer,
  EDU_CONTENT_SERVICE_TOKEN,
  getStoreModuleForFeatures,
  UserReducer
} from '@campus/dal';
import { FilterFactoryFixture, SearchModeInterface } from '@campus/search';
import { ENVIRONMENT_SEARCHMODES_TOKEN } from '@campus/shared';
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
import { MethodViewModel } from './method.viewmodel';

describe('MethodViewModel', () => {
  let methodViewModel: MethodViewModel;
  let store: Store<DalState>;
  let router: Router;
  let zone: NgZone;

  const bookId = 5;

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

  const book: EduContentBookInterface = new EduContentBookFixture({
    id: bookId,
    eduContentTOC: [...chapterTocs, ...lessonTocs]
  });

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
      sortModes: [],
      pageSize: 3
    }
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({ router: routerReducer }),
        ...getStoreModuleForFeatures([
          UserReducer,
          EduContentTocReducer,
          EduContentBookReducer
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
            search: () => {}
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

    methodViewModel = TestBed.get(MethodViewModel);
    store = TestBed.get(Store);
    zone = TestBed.get(NgZone);
    router = TestBed.get(Router);

    loadInStore();
  });

  function loadInStore() {
    store.dispatch(
      new EduContentBookActions.EduContentBooksLoaded({
        eduContentBooks: [book]
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

  describe('presentation streams', () => {
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
  });
});
