import { async, TestBed } from '@angular/core/testing';
import {
  CredentialActions,
  CredentialReducer,
  DalState,
  LearningAreaFixture,
  PassportUserCredentialInterface,
  PersonFixture,
  PersonInterface,
  StateFeatureBuilder,
  UiActions,
  UiReducer,
  UserActions,
  UserReducer
} from '@campus/dal';
import { DropdownMenuItemInterface, NavItem } from '@campus/ui';
import { Store, StoreModule } from '@ngrx/store';
import { hot } from '@nrwl/nx/testing';
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
          }
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
      {
        id: 1,
        profile: { platform: 'foo.smartschool.be' },
        provider: 'smartschool'
      }
    ]; //TODO use fixture, created in credential service branch
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
  });
});
