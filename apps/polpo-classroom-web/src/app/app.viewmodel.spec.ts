import { async, TestBed } from '@angular/core/testing';
import {
  LearningAreaFixture,
  PersonFixture,
  PersonInterface,
  StateFeatureBuilder,
  UserActions,
  UserReducer
} from '@campus/dal';
import { Store, StoreModule } from '@ngrx/store';
import { AppResolver } from './app.resolver';
import { AppViewModel } from './app.viewmodel';
import { NavItemService } from './services/nav-item-service';
describe('AppViewModel', () => {
  let usedUserState;
  let user: PersonInterface;
  let viewModel: AppViewModel;
  let appResolver: AppResolver;

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
          }
        ])
      ],
      providers: [
        AppViewModel,
        Store,
        { provide: AppResolver, useValue: { resolve: jest.fn() } },
        {
          provide: NavItemService,
          useValue: {
            getSideNavItems: jest.fn(),
            getProfileMenuItems: jest.fn()
          }
        }
      ]
    }).compileComponents();

    viewModel = TestBed.get(AppViewModel);
    appResolver = TestBed.get(AppResolver);
  }));

  beforeAll(() => {
    user = new PersonFixture();

    usedUserState = UserReducer.reducer(
      UserReducer.initialState,
      new UserActions.UserLoaded(user)
    );
  });

  describe('creation', () => {
    it('should be defined', () => {
      expect(viewModel).toBeDefined();
    });
    it('should call the TasksResolver.resolve', () => {
      expect(appResolver.resolve).toHaveBeenCalledTimes(1);
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
          profile: { platform: 'url-van-smartschoolplatform' },
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

    it('should dispatch actions', () => {});
  });
});
