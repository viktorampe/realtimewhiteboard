import { TestBed } from '@angular/core/testing';
import {
  DalState,
  EduContentFixture,
  NavItem,
  PersonFixture,
  PersonInterface,
  UserQueries
} from '@campus/dal';
import {
  NavigationItemServiceInterface,
  NAVIGATION_ITEM_SERVICE_TOKEN,
  OpenStaticContentServiceInterface,
  OPEN_STATIC_CONTENT_SERVICE_TOKEN
} from '@campus/shared';
import { MemoizedSelector, Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { hot } from '@nrwl/angular/testing';
import { configureTestSuite } from 'ng-bullet';
import { HomeViewModel } from './home.viewmodel';

describe('HomeViewModel', () => {
  let homeViewModel: HomeViewModel;
  let openStaticContentService: OpenStaticContentServiceInterface;

  let mockStore: MockStore<DalState>;
  let mockCurrentUserSelector: MemoizedSelector<DalState, PersonInterface>;

  let navigationItemService: NavigationItemServiceInterface;
  const mockNavItems: NavItem[] = [{ title: 'foo' }, { title: 'bar' }];

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideMockStore(),
        {
          provide: OPEN_STATIC_CONTENT_SERVICE_TOKEN,
          useValue: { open: jest.fn().mockReturnValue(mockNavItems) }
        },
        {
          provide: NAVIGATION_ITEM_SERVICE_TOKEN,
          useValue: {
            getNavItemsForTree: jest.fn().mockReturnValue(mockNavItems)
          }
        }
      ]
    });
  });

  beforeEach(() => {
    homeViewModel = TestBed.get(HomeViewModel);
    openStaticContentService = TestBed.get(OPEN_STATIC_CONTENT_SERVICE_TOKEN);
    navigationItemService = TestBed.get(NAVIGATION_ITEM_SERVICE_TOKEN);
    mockStore = TestBed.get(Store);
    mockCurrentUserSelector = mockStore.overrideSelector(
      UserQueries.getCurrentUser,
      new PersonFixture()
    );
  });

  describe('presentation streams', () => {
    describe('displayName$', () => {
      it("should return the current user's firstName if it is set", () => {
        const displayName = 'Janneke';
        const firstName = 'Jan';

        mockCurrentUserSelector.setResult(
          new PersonFixture({ firstName, displayName })
        );

        expect(homeViewModel.displayName$).toBeObservable(
          hot('a', {
            a: firstName
          })
        );
      });

      it("should return the current user's displayName if there is no firstName", () => {
        const displayName = 'Jan';

        mockCurrentUserSelector.setResult(
          new PersonFixture({ firstName: undefined, displayName })
        );

        expect(homeViewModel.displayName$).toBeObservable(
          hot('a', {
            a: displayName
          })
        );
      });
    });

    describe('dashboardNavItems$', () => {
      it('should return the nav items based on the user permission', () => {
        mockStore.overrideSelector(UserQueries.getPermissions, [
          'foo permission'
        ]);

        expect(homeViewModel.dashboardNavItems$).toBeObservable(
          hot('a', { a: mockNavItems })
        );

        expect(
          navigationItemService.getNavItemsForTree
        ).toHaveBeenCalledWith('dashboardNav', ['foo permission']);
      });
    });
  });

  describe('openBoeke', () => {
    it('should open a boek-e', () => {
      const eduContent = new EduContentFixture({
        id: 4
      });
      const spy = jest.spyOn(openStaticContentService, 'open');

      homeViewModel.openBoeke(eduContent);

      expect(spy).toHaveBeenCalledWith(eduContent);
    });
  });
});
