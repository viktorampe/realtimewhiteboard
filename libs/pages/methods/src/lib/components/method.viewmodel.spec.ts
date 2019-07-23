import { Component, NgZone } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AUTH_SERVICE_TOKEN,
  CustomSerializer,
  DalState,
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
import { configureTestSuite } from 'ng-bullet';
import { MethodViewModel } from './method.viewmodel';

describe('MethodViewModel', () => {
  let methodViewModel: MethodViewModel;
  let store: Store<DalState>;
  let router: Router;
  let zone: NgZone;

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
        ...getStoreModuleForFeatures([UserReducer]),
        RouterTestingModule.withRoutes([
          {
            path: '',
            redirectTo: 'methods',
            pathMatch: 'full'
          },
          {
            path: 'methods',
            component: Component,
            children: [
              {
                path: ':book',
                component: Component,
                children: [
                  {
                    path: ':chapter',
                    component: Component,
                    children: [
                      {
                        path: ':lesson',
                        component: Component
                      }
                    ]
                  }
                ]
              }
            ]
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
  });

  describe('creation', () => {
    it('should be defined', () => {
      expect(methodViewModel).toBeDefined();
    });
  });

  describe('presentation streams', () => {
    describe('currentToc$', () => {
      beforeEach(() => {
        zone.run(() => {
          const navigationAction = {
            type: ROUTER_NAVIGATION,
            payload: {
              routerState: { params: { bundle: '1' } },
              event: {}
            } as RouterNavigationPayload<any>
          } as RouterNavigationAction;
          store.dispatch(navigationAction);
        });
      });

      it('test', () => {
        methodViewModel['routerState$'].subscribe(x => {
          console.log(x);
        });
      });

      /*it('test', fakeAsync(done => {
        tick(1000);
        methodViewModel['routerState$'].subscribe(v => {
          console.log(v);
          done();
        });
      }));*/
    });
  });
});
