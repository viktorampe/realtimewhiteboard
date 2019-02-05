import { async, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { CredentialActions, CredentialFixture, CredentialReducer, DalActions, DalState, EffectFeedbackActions, EffectFeedbackFixture, EffectFeedbackReducer, LearningAreaFixture, PassportUserCredentialInterface, PersonFixture, PersonInterface, Priority, StateFeatureBuilder, UiActions, UiReducer, UserActions, UserReducer } from '@campus/dal';
import { FEEDBACK_SERVICE_TOKEN } from '@campus/shared';
import { DropdownMenuItemInterface, NavItem } from '@campus/ui';
import { Store, StoreModule } from '@ngrx/store';
import { hot } from '@nrwl/nx/testing';
import { of } from 'rxjs';
import { AppResolver } from './app.resolver';
import { AppViewModel } from './app.viewmodel';
import { NavItemService } from './services/nav-item-service';

describe('AppViewModel', () => {
  let user: PersonInterface;
  let viewModel: AppViewModel;
  let mockNavItem: NavItem;
  let mockProfileMenuItem: DropdownMenuItemInterface;
  let store: Store<DalState>;
  let mockCredentials: PassportUserCredentialInterface[];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
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
          EffectFeedbackReducer
        ])
      ],
      providers: [
        AppViewModel,
        { provide: AppResolver, useValue: { resolve: jest.fn() } },
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
            setupStreams: () => {},
            snackbarAfterDismiss$: of({
              dismissedWithAction: false,
              feedback: new EffectFeedbackFixture()
            })
          }
        }
      ]
    }).compileComponents();

    viewModel = TestBed.get(AppViewModel);
    store = TestBed.get(Store);
    spyOn(store, 'dispatch').and.callThrough();
  }));

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
  });

  beforeEach(() => {
    store.dispatch(new UserActions.UserLoaded(user));
    store.dispatch(
      new CredentialActions.CredentialsLoaded({
        credentials: mockCredentials
      })
    );
  });

  describe('creation', () => {
    it('should be defined', () => {
      expect(viewModel).toBeDefined();
    });
  });

  describe('intermediate streams', () => {
    it('should call the NavItemService', () => {
      const navItemService = TestBed.get(NavItemService);

      // current value hardcoded in viewmodel
      const mockFavorites = [
        {
          type: 'area', // TODO in selector: filter on type:'area'
          learningAreaId: 1,
          learningArea: new LearningAreaFixture({ icon: 'wiskunde' }),
          created: new Date(2018, 11 - 1, 30)
        }
      ];

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

    it('should load the sidenav status from the store', () => {
      store.dispatch(new UiActions.ToggleSideNav({ open: true }));
      expect(viewModel.sideNavOpen$).toBeObservable(hot('a', { a: true }));
      store.dispatch(new UiActions.ToggleSideNav({ open: false }));
      expect(viewModel.sideNavOpen$).toBeObservable(hot('a', { a: false }));
    });
  });

  describe('feedback', () => {
    let mockFeedBack;
    beforeAll(() => {
      const mockAction = {
        title: 'klik',
        userAction: new DalActions.ActionSuccessful({
          successfulAction: 'test'
        })
      };

      mockFeedBack = new EffectFeedbackFixture({
        id: '1',
        triggerAction: null,
        message: 'This is a message',
        type: 'success',
        userActions: [mockAction],
        timeStamp: 1,
        display: true,
        priority: Priority.HIGH,
        useDefaultCancel: false
      });
    });
    describe('error feedback', () => {
      beforeAll(() => {
        mockFeedBack.type = 'error';
      });

      it('should pass the error feedback to the banner-stream', fakeAsync(() => {
        store.dispatch(
          new EffectFeedbackActions.AddEffectFeedback({
            effectFeedback: mockFeedBack
          })
        );

        expect(viewModel.bannerFeedback$).toBeObservable(
          hot('a', { a: mockFeedBack })
        );

        // create a slightly newer mockFeedBack
        const slightlyNewerFeedback = {
          ...mockFeedBack,
          ...{ id: '2', timeStamp: mockFeedBack.timeStamp + 10 }
        };
        store.dispatch(
          new EffectFeedbackActions.AddEffectFeedback({
            effectFeedback: slightlyNewerFeedback
          })
        );

        // this should not change the output
        expect(viewModel.bannerFeedback$).toBeObservable(
          hot('a', { a: mockFeedBack })
        );

        // dismiss the banner
        viewModel.onBannerDismiss({
          action: mockFeedBack.userActions[0].userAction,
          feedbackId: mockFeedBack.id
        });

        // allow subscriptions to complete
        flush();

        // this should change the output
        expect(viewModel.bannerFeedback$).toBeObservable(
          hot('a', { a: slightlyNewerFeedback })
        );
      }));

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

      it('should pass add a cancel userAction when needed', () => {
        mockFeedBack.useDefaultCancel = true;
        store.dispatch(
          new EffectFeedbackActions.AddEffectFeedback({
            effectFeedback: mockFeedBack
          })
        );

        const cancelBannerAction = { title: 'annuleren', userAction: null };

        // add the cancel button
        const expectedFeedback = {
          ...mockFeedBack,
          ...{ userActions: [...mockFeedBack.userActions, cancelBannerAction] }
        };

        expect(viewModel.bannerFeedback$).toBeObservable(
          hot('a', { a: expectedFeedback })
        );
      });
    });
  });
});
