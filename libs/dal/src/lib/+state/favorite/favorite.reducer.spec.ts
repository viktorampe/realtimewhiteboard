import { Update } from '@ngrx/entity';
import {FavoriteActions } from '.';
import { initialState, reducer, State } from './favorite.reducer';
import { FavoriteInterface } from '../../+models';

/** 
 * This file is scaffolded, but needs some special attention:
 * - find and replace '__EXTRA__PROPERTY_NAME' and replace this with a property name of the Favorite entity.
 * - set the initial property value via '[__EXTRA__PROPERTY_NAME]InitialValue'.
 * - set the updated property value via '[__EXTRA__PROPERTY_NAME]UpdatedValue'.
*/
const __EXTRA__PROPERTY_NAMEInitialValue = ;
const __EXTRA__PROPERTY_NAMEUpdatedValue = ;

/**
 * Creates a Favorite.
 * @param {number} id
 * @returns {FavoriteInterface}
 */
function createFavorite(id: number, __EXTRA__PROPERTY_NAME:any = __EXTRA__PROPERTY_NAMEInitialValue): FavoriteInterface | any {
  return {
    id: id,
    __EXTRA__PROPERTY_NAME: __EXTRA__PROPERTY_NAME
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
    favorites = [
      createFavorite(1),
      createFavorite(2),
      createFavorite(3)
    ];
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
  describe('upsert actions', () => {
    it('should upsert one favorite', () => {
      const originalFavorite = favorites[0];
      
      const startState = reducer(
        initialState,
        new FavoriteActions.AddFavorite({
          favorite: originalFavorite
        })
      );

    
      const updatedFavorite = createFavorite(favorites[0].id, 'test');
     
      const action = new FavoriteActions.UpsertFavorite({
        favorite: updatedFavorite
      });

      const result = reducer(startState, action);

      expect(result.entities[updatedFavorite.id]).toEqual(updatedFavorite);
    });

    it('should upsert many favorites', () => {
      const startState = createState(favorites);

      const favoritesToInsert = [
        createFavorite(1),
        createFavorite(2),
        createFavorite(3),
        createFavorite(4)
      ];
      const action = new FavoriteActions.UpsertFavorites({
        favorites: favoritesToInsert
      });

      const result = reducer(startState, action);

      expect(result).toEqual(
        createState(favoritesToInsert)
      );
    });
  });

  describe('update actions', () => {
    it('should update an favorite', () => {
      const favorite = favorites[0];
      const startState = createState([favorite]);
      const update: Update<FavoriteInterface> = {
        id: 1,
        changes: {
          __EXTRA__PROPERTY_NAME: __EXTRA__PROPERTY_NAMEUpdatedValue
        } 
      };
      const action = new FavoriteActions.UpdateFavorite({
        favorite: update
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([createFavorite(1, __EXTRA__PROPERTY_NAMEUpdatedValue)]));
    });

    it('should update multiple favorites', () => {
      const startState = createState(favorites);
      const updates: Update<FavoriteInterface>[] = [
        
        {
          id: 1,
          changes: {
            __EXTRA__PROPERTY_NAME: __EXTRA__PROPERTY_NAMEUpdatedValue
          } 
        },
        {
          id: 2,
          changes: {
            __EXTRA__PROPERTY_NAME: __EXTRA__PROPERTY_NAMEUpdatedValue
          }  
        }
      ];
      const action = new FavoriteActions.UpdateFavorites({
        favorites: updates
      });
      const result = reducer(startState, action);

      expect(result).toEqual(
        createState([createFavorite(1, __EXTRA__PROPERTY_NAMEUpdatedValue), createFavorite(2, __EXTRA__PROPERTY_NAMEUpdatedValue), favorites[2]])
      );
    });
  });

  describe('delete actions', () => {
    it('should delete one favorite ', () => {
      const favorite = favorites[0];
      const startState = createState([favorite]);
      const action = new FavoriteActions.DeleteFavorite({
        id: favorite.id
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
