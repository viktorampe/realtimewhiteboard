import { FavoriteQueries } from '.';
import { FavoriteInterface } from '../../+models';
import { State } from './favorite.reducer';

describe('Favorite Selectors', () => {
  function createFavorite(id: number): FavoriteInterface | any {
    return {
      id: id
    };
  }

  function createState(
    favorites: FavoriteInterface[],
    loaded: boolean = false,
    error?: any
  ): State {
    return {
      ids: favorites ? favorites.map(favorite => favorite.id) : [],
      entities: favorites
        ? favorites.reduce(
            (entityMap, favorite) => ({
              ...entityMap,
              [favorite.id]: favorite
            }),
            {}
          )
        : {},
      loaded: loaded,
      error: error
    };
  }

  let favoriteState: State;
  let storeState: any;

  describe('Favorite Selectors', () => {
    beforeEach(() => {
      favoriteState = createState(
        [
          createFavorite(4),
          createFavorite(1),
          createFavorite(2),
          createFavorite(3)
        ],
        true,
        'no error'
      );
      storeState = { favorites: favoriteState };
    });
    it('getError() should return the error', () => {
      const results = FavoriteQueries.getError(storeState);
      expect(results).toBe(favoriteState.error);
    });
    it('getLoaded() should return the loaded boolean', () => {
      const results = FavoriteQueries.getLoaded(storeState);
      expect(results).toBe(favoriteState.loaded);
    });
    it('getAll() should return an array of the entities in the order from the ids', () => {
      const results = FavoriteQueries.getAll(storeState);
      expect(results).toEqual([
        createFavorite(4),
        createFavorite(1),
        createFavorite(2),
        createFavorite(3)
      ]);
    });
    it('getCount() should return number of entities', () => {
      const results = FavoriteQueries.getCount(storeState);
      expect(results).toBe(4);
    });
    it('getIds() should return an array with ids in the correct order', () => {
      const results = FavoriteQueries.getIds(storeState);
      expect(results).toEqual([4, 1, 2, 3]);
    });
    it('getAllEntities() should return a key value object with all the entities', () => {
      const results = FavoriteQueries.getAllEntities(storeState);
      expect(results).toEqual(favoriteState.entities);
    });
    it('getByIds() should return an array of the requested entities in order and undefined if the id is not present', () => {
      const results = FavoriteQueries.getByIds(storeState, {
        ids: [3, 1, 90, 2]
      });
      expect(results).toEqual([
        createFavorite(3),
        createFavorite(1),
        undefined,
        createFavorite(2)
      ]);
    });
    it('getById() should return the desired entity', () => {
      const results = FavoriteQueries.getById(storeState, { id: 2 });
      expect(results).toEqual(createFavorite(2));
    });
    it('getById() should return undefined if the entity is not present', () => {
      const results = FavoriteQueries.getById(storeState, { id: 9 });
      expect(results).toBe(undefined);
    });
  });
});
