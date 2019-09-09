import { TestBed } from '@angular/core/testing';
import { EduContentFixture, getStoreModuleForFeatures } from '@campus/dal';
import {
  OpenStaticContentServiceInterface,
  OPEN_STATIC_CONTENT_SERVICE_TOKEN
} from '@campus/shared';
import { routerReducer } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { configureTestSuite } from 'ng-bullet';
import { HomeViewModel } from './home.viewmodel';

describe('HomeViewModel', () => {
  let homeViewModel: HomeViewModel;
  let openStaticContentService: OpenStaticContentServiceInterface;

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
    homeViewModel = TestBed.get(HomeViewModel);
    openStaticContentService = TestBed.get(OPEN_STATIC_CONTENT_SERVICE_TOKEN);
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
