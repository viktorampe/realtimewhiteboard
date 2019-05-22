import { FavoriteQueries } from '.';
import { FavoriteFixture } from '../../+fixtures';
import { FavoriteInterface, FavoriteTypesEnum } from '../../+models';
import { State } from './favorite.reducer';

describe('Favorite Selectors', () => {
  function createFavorite(
    id: number,
    type: FavoriteTypesEnum = FavoriteTypesEnum.AREA,
    eduContentId: number = null
  ): FavoriteInterface | any {
    return {
      id: id,
      type: type,
      eduContentId: eduContentId
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

    it('getByType() should return all favorites with the provided type', () => {
      favoriteState = createState(
        [
          createFavorite(4, FavoriteTypesEnum.BOEKE),
          createFavorite(1),
          createFavorite(2, FavoriteTypesEnum.BOEKE),
          createFavorite(3, FavoriteTypesEnum.BUNDLE)
        ],
        true,
        'no error'
      );

      storeState = { favorites: favoriteState };

      const results = FavoriteQueries.getByType(storeState, {
        type: FavoriteTypesEnum.BOEKE
      });

      expect(results).toEqual([
        createFavorite(2, FavoriteTypesEnum.BOEKE),
        createFavorite(4, FavoriteTypesEnum.BOEKE)
      ]);
    });

    describe('getByTypeAndId()', () => {
      beforeEach(() => {
        const mockFavorites: FavoriteInterface[] = [
          {
            id: 1,
            type: FavoriteTypesEnum.BOEKE,
            eduContentId: 15
          } as FavoriteInterface,
          {
            id: 2,
            type: FavoriteTypesEnum.BOEKE,
            eduContentId: 10
          } as FavoriteInterface,
          {
            id: 3,
            type: FavoriteTypesEnum.AREA,
            learningAreaId: 5
          } as FavoriteInterface,
          {
            id: 4,
            type: FavoriteTypesEnum.BUNDLE,
            eduContentId: 12
          } as FavoriteInterface
        ];
        favoriteState = createState(mockFavorites, true, 'no error');

        storeState = { favorites: favoriteState };
      });
      it('getByTypeAndId() should return the favorite with the provided type and id', () => {
        const results = FavoriteQueries.getByTypeAndId(storeState, {
          type: FavoriteTypesEnum.BOEKE,
          id: 15
        });

        expect(results).toEqual({
          id: 1,
          type: FavoriteTypesEnum.BOEKE,
          eduContentId: 15
        } as FavoriteInterface);
      });

      it('getByTypeAndId() should return undefined if the provided type and id are not yet marked as favorite', () => {
        const results = FavoriteQueries.getByTypeAndId(storeState, {
          type: FavoriteTypesEnum.AREA,
          id: 15
        });

        expect(results).toEqual(undefined);
      });
    });

    describe('getIsFavoriteEduContent()', () => {
      beforeEach(() => {
        const mockFavorites: FavoriteInterface[] = [
          {
            id: 1,
            type: FavoriteTypesEnum.BOEKE,
            eduContentId: 15
          } as FavoriteInterface,
          {
            id: 2,
            type: FavoriteTypesEnum.BOEKE,
            eduContentId: 10
          } as FavoriteInterface,
          {
            id: 3,
            type: FavoriteTypesEnum.AREA,
            learningAreaId: 5
          } as FavoriteInterface,
          {
            id: 4,
            type: FavoriteTypesEnum.BUNDLE,
            eduContentId: 12
          } as FavoriteInterface
        ];
        favoriteState = createState(mockFavorites, true, 'no error');

        storeState = { favorites: favoriteState };
      });

      it('should return if an eduContent is a favorite', () => {
        const resultsTrue = FavoriteQueries.getIsFavoriteEduContent(
          storeState,
          {
            eduContentId: 15
          }
        );

        expect(resultsTrue).toEqual(true);

        const resultsFalse = FavoriteQueries.getIsFavoriteEduContent(
          storeState,
          {
            eduContentId: 123456789
          }
        );

        expect(resultsFalse).toEqual(false);
      });
    });

    describe('favoritesByType', () => {
      let mockFavorites: FavoriteInterface[];

      beforeEach(() => {
        mockFavorites = [
          new FavoriteFixture({ id: 1, type: 'foo', created: new Date(1) }),
          new FavoriteFixture({ id: 2, type: 'foo', created: new Date(2) }),
          new FavoriteFixture({ id: 3, type: 'bar', created: new Date(229) }),
          new FavoriteFixture({ id: 4, type: 'baz', created: new Date(1) }),
          new FavoriteFixture({ id: 5, type: 'bar', created: new Date(114) })
        ];

        favoriteState = createState(mockFavorites, true, 'no error');
        storeState = { favorites: favoriteState };
      });

      it('should group the historyitems by type, ordered -descending- by created date', () => {
        const result = FavoriteQueries.favoritesByType(storeState);

        const expected = {
          foo: [mockFavorites[1], mockFavorites[0]],
          bar: [mockFavorites[2], mockFavorites[4]],
          baz: [mockFavorites[3]]
        };

        expect(result).toEqual(expected);
      });
    });
  });
});
