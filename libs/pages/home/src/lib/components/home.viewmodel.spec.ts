import { TestBed } from '@angular/core/testing';
import {
  EduContentFixture,
  getStoreModuleForFeatures,
  PersonFixture,
  UserQueries
} from '@campus/dal';
import {
  OpenStaticContentServiceInterface,
  OPEN_STATIC_CONTENT_SERVICE_TOKEN
} from '@campus/shared';
import { routerReducer } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { hot } from '@nrwl/nx/testing';
import { configureTestSuite } from 'ng-bullet';
import { HomeViewModel } from './home.viewmodel';

describe('HomeViewModel', () => {
  let homeViewModel: HomeViewModel;
  let openStaticContentService: OpenStaticContentServiceInterface;
  let selectorSpies: {
    currentUser: jest.SpyInstance;
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({ router: routerReducer }),
        ...getStoreModuleForFeatures([])
      ],
      providers: [
        {
          provide: OPEN_STATIC_CONTENT_SERVICE_TOKEN,
          useValue: { open: jest.fn() }
        }
      ]
    });
  });

  beforeEach(() => {
    setupSelectorSpies();

    homeViewModel = TestBed.get(HomeViewModel);
    openStaticContentService = TestBed.get(OPEN_STATIC_CONTENT_SERVICE_TOKEN);
  });

  function setupSelectorSpies() {
    selectorSpies = {
      //Used by userFirstName$
      currentUser: jest.spyOn(UserQueries, 'getCurrentUser')
    };
  }

  describe('presentation streams', () => {
    describe('userFirstName$', () => {
      it("should return the current user's first name", () => {
        const firstName = 'Jan';

        selectorSpies.currentUser.mockReturnValue(
          new PersonFixture({ firstName, name: 'Smit' })
        );

        expect(homeViewModel.userFirstName$).toBeObservable(
          hot('a', {
            a: firstName
          })
        );
      });

      it('should return an empty string if the current user has no first name', () => {
        const firstName = undefined;

        selectorSpies.currentUser.mockReturnValue(
          new PersonFixture({ firstName, name: 'Smit' })
        );

        expect(homeViewModel.userFirstName$).toBeObservable(
          hot('a', {
            a: ''
          })
        );
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
