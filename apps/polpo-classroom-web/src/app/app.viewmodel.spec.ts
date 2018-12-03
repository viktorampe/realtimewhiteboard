import { async, TestBed } from '@angular/core/testing';
import {
  DalState,
  LearningAreaFixture,
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
import { hot } from 'jasmine-marbles';
import { AppResolver } from './app.resolver';
import { AppViewModel } from './app.viewmodel';
import { NavItemService } from './services/nav-item-service';

describe('AppViewModel', () => {
  let usedUserState;
  let user: PersonInterface;
  let viewModel: AppViewModel;
  let mockNavItem: NavItem;
  let mockProfileMenuItem: DropdownMenuItemInterface;
  let store: Store<DalState>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        ...StateFeatureBuilder.getModuleWithForFeatureProviders([
          {
            NAME: UserReducer.NAME,
            reducer: UserReducer.reducer,
            initialState: {
              initialState: usedUserState
            }
          },
          {
            NAME: UiReducer.NAME,
            reducer: UiReducer.reducer,
            initialState: UiReducer.initialState
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

    usedUserState = UserReducer.reducer(
      UserReducer.initialState,
      new UserActions.UserLoaded(user)
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

      // current value hardcoded in viewmodel
      const mockCredentials = [
        {
          profile: { platform: 'foo.smartschool.be' },
          provider: 'smartschool'
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
