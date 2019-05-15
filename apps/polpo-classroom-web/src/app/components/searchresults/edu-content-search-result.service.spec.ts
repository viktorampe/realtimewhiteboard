import { inject, TestBed } from '@angular/core/testing';
import {
  DalState,
  FavoriteActions,
  FavoriteFixture,
  FavoriteReducer,
  getStoreModuleForFeatures
} from '@campus/dal';
import { Store, StoreModule } from '@ngrx/store';
import { hot } from '@nrwl/nx/testing';
import { EduContentSearchResultItemService } from './edu-content-search-result.service';

describe('EduContentSearchResultItemService', () => {
  let eduContentSearchResultItemService: EduContentSearchResultItemService;
  let store: Store<DalState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        ...getStoreModuleForFeatures([FavoriteReducer])
      ],
      providers: [EduContentSearchResultItemService, Store]
    });

    eduContentSearchResultItemService = TestBed.get(
      EduContentSearchResultItemService
    );

    store = TestBed.get(Store);
  });

  it('should be created', inject(
    [EduContentSearchResultItemService],
    (service: EduContentSearchResultItemService) => {
      expect(service).toBeTruthy();
    }
  ));

  describe('isFavorite$', () => {
    it('should return data from the store', () => {
      const eduContentId = 42;
      const favorite = new FavoriteFixture({
        eduContentId
      });
      store.dispatch(
        new FavoriteActions.FavoritesLoaded({ favorites: [favorite] })
      );

      expect(
        eduContentSearchResultItemService.isFavorite$(eduContentId)
      ).toBeObservable(hot('a', { a: true }));
      expect(
        eduContentSearchResultItemService.isFavorite$(eduContentId + 1)
      ).toBeObservable(hot('a', { a: false }));
    });
  });

  describe('toggleFavorite', () => {
    it('should dispatch a ToggleFavorite action', () => {
      store.dispatch = jest.fn();
      const favorite = new FavoriteFixture();

      eduContentSearchResultItemService.toggleFavorite(favorite);

      expect(store.dispatch).toHaveBeenCalled();
      expect(store.dispatch).toHaveBeenCalledWith(
        new FavoriteActions.ToggleFavorite({ favorite })
      );
    });
  });
});
