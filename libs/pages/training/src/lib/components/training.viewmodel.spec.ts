import { NgZone } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AUTH_SERVICE_TOKEN,
  CustomSerializer,
  DalState,
  getStoreModuleForFeatures
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
import { configureTestSuite } from 'ng-bullet';
import { TrainingViewModel } from './training.viewmodel';

describe('MethodViewModel', () => {
  let trainingViewModel: TrainingViewModel;
  let store: Store<DalState>;
  let router: Router;
  let zone: NgZone;

  const userId = 1;

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
    trainingViewModel = TestBed.get(TrainingViewModel);
    store = TestBed.get(Store);
    router = TestBed.get(Router);
  });

  describe('creation', () => {
    it('should be defined', () => {
      expect(trainingViewModel).toBeDefined();
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
