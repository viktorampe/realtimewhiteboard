import { Update } from '@ngrx/entity';
import { FavoriteActions } from '.';
import { FavoriteInterface } from '../../+models';
import { initialState, reducer, State } from './favorite.reducer';

const typeInitialValue = 'foo';
const typeUpdatedValue = 'bar';

/**
 * Creates a Favorite.
 * @param {number} id
 * @returns {FavoriteInterface}
 */
function createFavorite(
  id: number,
  type: any = typeInitialValue
): FavoriteInterface | any {
  return {
    id: id,
    type: type
  };
}

/**
 * Utility to create the favorite state.
 *
 * @param {FavoriteInterface[]} favorites
 * @param {boolean} [loaded]
 * @param {*} [error]
 * @returns {State}
 */
function createState(
  favorites: FavoriteInterface[],
  loaded: boolean = false,
  error?: any
): State {
  const state: any = {
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
    loaded: loaded
  };
  if (error !== undefined) state.error = error;
  return state;
}

describe('Favorites Reducer', () => {
  let favorites: FavoriteInterface[];
  beforeEach(() => {
    favorites = [createFavorite(1), createFavorite(2), createFavorite(3)];
  });

  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });

  describe('loaded action', () => {
    it('should load all favorites', () => {
      const action = new FavoriteActions.FavoritesLoaded({ favorites });
      const result = reducer(initialState, action);
      expect(result).toEqual(createState(favorites, true));
    });

    it('should error', () => {
      const error = 'Something went wrong';
      const action = new FavoriteActions.FavoritesLoadError(error);
      const result = reducer(initialState, action);
      expect(result).toEqual(createState([], false, error));
    });
  });

  describe('add actions', () => {
    it('should add one favorite', () => {
      const favorite = favorites[0];
      const action = new FavoriteActions.AddFavorite({
        favorite
      });

      const result = reducer(initialState, action);
      expect(result).toEqual(createState([favorite], false));
    });

    it('should add multiple favorites', () => {
      const action = new FavoriteActions.AddFavorites({ favorites });
      const result = reducer(initialState, action);

      expect(result).toEqual(createState(favorites, false));
    });
  });

  describe('update actions', () => {
    it('should update a favorite', () => {
      const favorite = favorites[0];
      const startState = createState([favorite]);
      const update: Update<FavoriteInterface> = {
        id: favorite.id,
        changes: {
          type: typeUpdatedValue
        }
      };
      const action = new FavoriteActions.UpdateFavorite({
        userId: 1,
        favorite: update,
        customFeedbackHandlers: { useCustomErrorHandler: true }
      });
      const result = reducer(startState, action);
      expect(result).toEqual(
        createState([createFavorite(1, typeUpdatedValue)])
      );
    });
  });

  describe('delete actions', () => {
    it('should delete one favorite ', () => {
      const favorite = favorites[0];
      const startState = createState([favorite]);
      const action = new FavoriteActions.DeleteFavorite({
        id: favorite.id,
        userId: 1
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([]));
    });

    it('should delete multiple favorites', () => {
      const startState = createState(favorites);
      const action = new FavoriteActions.DeleteFavorites({
        ids: [favorites[0].id, favorites[1].id]
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([favorites[2]]));
    });
  });

  describe('clear action', () => {
    it('should clear the favorites collection', () => {
      const startState = createState(favorites, true, 'something went wrong');
      const action = new FavoriteActions.ClearFavorites();
      const result = reducer(startState, action);
      expect(result).toEqual(createState([], true, 'something went wrong'));
    });
  });
});
