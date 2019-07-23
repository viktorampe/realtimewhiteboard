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

  const books: EduContentBookInterface[] = [
    new EduContentBookFixture({
      id: 5,
      eduContentTOC: [
        new EduContentTOCFixture({ id: 1, treeId: 5 }),
        new EduContentTOCFixture({ id: 2, treeId: 5 })
      ]
    }),
    new EduContentBookFixture({
      id: 6,
      eduContentTOC: [
        new EduContentTOCFixture({ id: 3, treeId: 6 }),
        new EduContentTOCFixture({ id: 4, treeId: 6 })
      ]
    })
  ];

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
        eduContentBooks: books
      })
    );

    books.forEach(book => {
      store.dispatch(
        new EduContentTocActions.AddEduContentTocsForBook({
          bookId: book.id,
          eduContentTocs: book.eduContentTOC
        })
      );
    });
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

      it('should be an empty array when no book, chapter or lesson is selected', () => {
        navigateWithParams({});

        expect(methodViewModel.currentToc$).toBeObservable(
          hot('a', {
            a: []
          })
        );
      });

      it('should return tocs for book when book is selected', () => {
        const book = books[0];
        navigateWithParams({ book: book.id });

        expect(methodViewModel.currentToc$).toBeObservable(
          hot('a', {
            a: book.eduContentTOC
          })
        );
      });
    });
  });
});
