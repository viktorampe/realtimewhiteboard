import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  CredentialActions,
  CredentialFixture,
  CredentialReducer,
  DalActions,
  DalState,
  EffectFeedbackActions,
  EffectFeedbackFixture,
  EffectFeedbackInterface,
  EffectFeedbackReducer,
  FavoriteActions,
  FavoriteFixture,
  FavoriteInterface,
  FavoriteReducer,
  LearningAreaActions,
  LearningAreaFixture,
  LearningAreaInterface,
  LearningAreaReducer,
  PassportUserCredentialInterface,
  PersonFixture,
  PersonInterface,
  Priority,
  StateFeatureBuilder,
  UiActions,
  UiReducer,
  UserActions,
  UserReducer
} from '@campus/dal';
import {
  FeedBackServiceInterface,
  FEEDBACK_SERVICE_TOKEN
} from '@campus/shared';
import { DropdownMenuItemInterface, NavItem } from '@campus/ui';
import {
  RouterNavigationAction,
  RouterNavigationPayload,
  routerReducer,
  ROUTER_NAVIGATION
} from '@ngrx/router-store';
import { Action, Store, StoreModule } from '@ngrx/store';
import { hot } from '@nrwl/angular/testing';
import { configureTestSuite } from 'ng-bullet';
import { BehaviorSubject, of } from 'rxjs';
import { AppViewModel } from './app.viewmodel';
import { NavItemService } from './services/nav-item-service';

describe('AppViewModel', () => {
  let user: PersonInterface;
  let viewModel: AppViewModel;
  let mockNavItem: NavItem;
  let mockProfileMenuItem: DropdownMenuItemInterface;
  let store: Store<DalState>;
  let mockCredentials: PassportUserCredentialInterface[];
  let mockFeedBack: EffectFeedbackInterface;
  let mockLearningAreas: LearningAreaInterface[];
  let mockFavorites: FavoriteInterface[];
  let mockAction: Action;
  let storeSpy: jest.SpyInstance;
  let router: Router;
  let breakpointSubject: BehaviorSubject<BreakpointState>;
  let feedbackService: FeedBackServiceInterface;

  beforeAll(() => {
    user = new PersonFixture();
    mockNavItem = { title: 'mock' };
    mockProfileMenuItem = { description: 'mock' };
    mockCredentials = [
      new CredentialFixture({
        id: 1,
        profile: { platform: 'foo.smartschool.be' },
        provider: 'smartschool'
      }),
      new CredentialFixture({
        id: 2,
        profile: { platform: 'foo.facebook.com' },
        provider: 'facebook'
      })
    ];

    mockAction = new DalActions.ActionSuccessful({
      successfulAction: 'test'
    });

    mockFeedBack = new EffectFeedbackFixture({
      id: '1',
      triggerAction: null,
      message: 'This is a message',
      type: 'success',
      userActions: [
        {
          title: 'klik',
          userAction: mockAction
        }
      ],
      timeStamp: 1,
      display: true,
      priority: Priority.HIGH,
      useDefaultCancel: false
    });

    mockLearningAreas = [
      new LearningAreaFixture({ id: 1 }),
      new LearningAreaFixture({ id: 2 })
    ];

    mockFavorites = [
      new FavoriteFixture({
        id: 1,
        type: 'area', // TODO in selector: filter on type:'area'
        learningAreaId: 1,
        learningArea: mockLearningAreas[0],
        created: new Date(2018, 11 - 1, 30)
      })
    ];
  });

  configureTestSuite(() => {
    breakpointSubject = new BehaviorSubject<BreakpointState>(<BreakpointState>{
      matches: false
    });

    const fakeObserve = () => breakpointSubject.asObservable();

    const breakpointSpy = { observe: jest.fn() };
    breakpointSpy.observe.mockImplementation(fakeObserve);

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          {
            path: 'test',
            component: Component,
            pathMatch: 'full'
          },
          {
            path: 'test2',
            component: Component,
            pathMatch: 'full'
          }
        ]),
        StoreModule.forRoot(
          { router: routerReducer },
          {
            runtimeChecks: {
              strictStateImmutability: false,
              strictActionImmutability: false
            }
          }
        ),
        ...StateFeatureBuilder.getModuleWithForFeatureProviders([
          {
            NAME: UserReducer.NAME,
            reducer: UserReducer.reducer,
            initialState: UserReducer.initialState
          },
          {
            NAME: UiReducer.NAME,
            reducer: UiReducer.reducer,
            initialState: UiReducer.initialState
          },
          {
            NAME: CredentialReducer.NAME,
            reducer: CredentialReducer.reducer,
            initialState: CredentialReducer.initialState
          },
          FavoriteReducer,
          LearningAreaReducer,
          EffectFeedbackReducer
        ])
      ],
      providers: [
        AppViewModel,
        Store,
        { provide: BreakpointObserver, useValue: breakpointSpy },
        {
          provide: NavItemService,
          useValue: {
            getSideNavItems: jest.fn().mockReturnValue([mockNavItem]),
            getProfileMenuItems: jest
              .fn()
              .mockReturnValue([mockProfileMenuItem])
          }
        },
        {
          provide: FEEDBACK_SERVICE_TOKEN,
          useValue: {
            addDefaultCancelButton: () => mockFeedBack,

            openSnackbar: () => ({
              snackbarRef: {},
              feedback: mockFeedBack
            }),

            snackbarAfterDismiss: () =>
              of({
                actionToDispatch: mockAction,
                feedback: mockFeedBack
              })
          }
        }
      ]
    });

    viewModel = TestBed.get(AppViewModel);
    store = TestBed.get(Store);
    router = TestBed.get(Router);
    feedbackService = TestBed.get(FEEDBACK_SERVICE_TOKEN);
  });

  beforeEach(() => {
    store.dispatch(new UserActions.UserLoaded(user));
    store.dispatch(
      new CredentialActions.CredentialsLoaded({
        credentials: mockCredentials
      })
    );
    store.dispatch(
      new LearningAreaActions.LearningAreasLoaded({
        learningAreas: mockLearningAreas
      })
    );
    store.dispatch(
      new FavoriteActions.FavoritesLoaded({
        favorites: mockFavorites
      })
    );

    storeSpy = jest.spyOn(store, 'dispatch');
  });

  describe('creation', () => {
    it('should be defined', () => {
      expect(viewModel).toBeDefined();
    });
  });

  describe('intermediate streams', () => {
    it('should call the NavItemService', () => {
      const navItemService = TestBed.get(NavItemService);

      expect(navItemService.getSideNavItems).toHaveBeenCalledWith(
        user,
        mockFavorites
      );

      expect(navItemService.getProfileMenuItems).toHaveBeenCalledWith(
        user,
        mockCredentials
      );
    });

    it('should build the presentationstream', () => {
      expect(viewModel.navigationItems$).toBeObservable(
        hot('a', { a: [mockNavItem] })
      );
    });

    describe('sidebar toggling', () => {
      const navigationAction = {
        type: ROUTER_NAVIGATION,
        payload: {
          routerState: {},
          event: {}
        } as RouterNavigationPayload<any>
      } as RouterNavigationAction;

      beforeEach(() => {
        //Enable the subscription (normally called in app.component AfterViewInit)
        viewModel.toggleSidebarOnNavigation();
      });

      it('should hide sidebar on router navigation on mobile', fakeAsync(() => {
        breakpointSubject.next(<BreakpointState>{ matches: true });

        jest.spyOn(viewModel, 'toggleSidebar');
        store.dispatch(navigationAction);
        tick();
        expect(viewModel.toggleSidebar).toHaveBeenCalled();
        expect(viewModel.toggleSidebar).toHaveBeenCalledWith(false);
      }));

      it('should show sidebar on router navigation on desktop', fakeAsync(() => {
        breakpointSubject.next(<BreakpointState>{ matches: false });

        jest.spyOn(viewModel, 'toggleSidebar');
        store.dispatch(navigationAction);
        tick();
        expect(viewModel.toggleSidebar).toHaveBeenCalled();
        expect(viewModel.toggleSidebar).toHaveBeenCalledWith(true);
      }));

      it('should hide sidebar on screen size change on mobile', fakeAsync(() => {
        jest.spyOn(viewModel, 'toggleSidebar');
        breakpointSubject.next(<BreakpointState>{ matches: true });
        tick();
        expect(viewModel.toggleSidebar).toHaveBeenCalled();
        expect(viewModel.toggleSidebar).toHaveBeenCalledWith(false);
      }));

      it('should show sidebar on screen size change on desktop', fakeAsync(() => {
        jest.spyOn(viewModel, 'toggleSidebar');
        breakpointSubject.next(<BreakpointState>{ matches: false });
        tick();
        expect(viewModel.toggleSidebar).toHaveBeenCalled();
        expect(viewModel.toggleSidebar).toHaveBeenCalledWith(true);
      }));
    });

    it('should dispatch actions on user update', () => {
      store.dispatch(new UserActions.UserLoaded(new PersonFixture()));

      expect(store.dispatch).toHaveBeenCalledWith(
        new UiActions.SetSideNavItems({ navItems: [mockNavItem] })
      );
      expect(store.dispatch).toHaveBeenCalledWith(
        new UiActions.SetProfileMenuItems({
          menuItems: [mockProfileMenuItem]
        })
      );
    });

    it('should dispatch action on sidenav toggle', () => {
      store.dispatch(new UserActions.UserLoaded(new PersonFixture()));
      viewModel.toggleSidebar(true);
      expect(store.dispatch).toHaveBeenCalledWith(
        new UiActions.ToggleSideNav({ open: true })
      );
    });

    it('should dispatch action on sidenavItem change', () => {
      store.dispatch(new UserActions.UserLoaded(new PersonFixture()));
      viewModel.onNavItemChanged(mockNavItem);
      expect(store.dispatch).toHaveBeenCalledWith(
        new UiActions.UpdateNavItem({ navItem: mockNavItem })
      );
    });

    it('should load the sidenav status from the store', () => {
      store.dispatch(new UiActions.ToggleSideNav({ open: true }));
      expect(viewModel.sideNavOpen$).toBeObservable(hot('a', { a: true }));
      store.dispatch(new UiActions.ToggleSideNav({ open: false }));
      expect(viewModel.sideNavOpen$).toBeObservable(hot('a', { a: false }));
    });
  });

  describe('feedback', () => {
    describe('success feedback', () => {
      beforeAll(() => {
        mockFeedBack.type = 'success';
      });

      it('should pass the success feedback to the feedbackService', () => {
        jest.spyOn(feedbackService, 'openSnackbar');

        store.dispatch(
          new EffectFeedbackActions.AddEffectFeedback({
            effectFeedback: mockFeedBack
          })
        );

        expect(feedbackService.openSnackbar).toHaveBeenCalled();
        expect(feedbackService.openSnackbar).toHaveBeenCalledWith(mockFeedBack);
      });

      it('should subscribe to snackbarAfterDismiss', () => {
        jest.spyOn(viewModel, 'onFeedbackDismiss');

        store.dispatch(
          new EffectFeedbackActions.AddEffectFeedback({
            effectFeedback: mockFeedBack
          })
        );

        // feedbackService.snackbarAfterDismiss is mocked and always emits a value

        expect(viewModel.onFeedbackDismiss).toHaveBeenCalled();
      });
    });

    describe('error feedback', () => {
      beforeAll(() => {
        mockFeedBack.type = 'error';
      });

      it('should pass the error feedback to the banner-stream', () => {
        store.dispatch(
          new EffectFeedbackActions.AddEffectFeedback({
            effectFeedback: mockFeedBack
          })
        );

        expect(viewModel.bannerFeedback$).toBeObservable(
          hot('a', { a: mockFeedBack })
        );
      });
    });

    describe('feedback event handling', () => {
      let mockEvent: { action: Action; feedbackId: string };
      let removeFeedbackAction: Action;

      beforeEach(() => {
        mockEvent = { action: mockAction, feedbackId: mockFeedBack.id };
      });

      it('should dispatch a removeFeedback action', () => {
        removeFeedbackAction = new EffectFeedbackActions.DeleteEffectFeedback({
          id: mockFeedBack.id,
          userAction: mockAction
        });
        viewModel.onFeedbackDismiss(mockEvent);

        expect(store.dispatch).toHaveBeenCalledWith(removeFeedbackAction);
      });

      it('should dispatch the event action, if available', () => {
        removeFeedbackAction = new EffectFeedbackActions.DeleteEffectFeedback({
          id: mockFeedBack.id,
          userAction: mockAction
        });
        // with action
        viewModel.onFeedbackDismiss(mockEvent);
        expect(store.dispatch).toHaveBeenCalledTimes(2);
        expect(store.dispatch).toHaveBeenCalledWith(removeFeedbackAction);
        expect(store.dispatch).toHaveBeenCalledWith(mockEvent.action);

        // without action
        removeFeedbackAction = new EffectFeedbackActions.DeleteEffectFeedback({
          id: mockFeedBack.id
        });
        storeSpy.mockClear();
        const mockEventWithoutAction = {
          action: null,
          feedbackId: mockFeedBack.id
        };
        viewModel.onFeedbackDismiss(mockEventWithoutAction);
        expect(store.dispatch).toHaveBeenCalledTimes(1);
        expect(store.dispatch).toHaveBeenCalledWith(removeFeedbackAction);
      });
    });
  });
});
