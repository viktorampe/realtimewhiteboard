import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { undo } from 'ngrx-undo';
import { from } from 'rxjs';
import { FavoriteActions } from '.';
import { DalState } from '..';
import {
  EffectFeedback,
  EffectFeedbackActions,
  Priority
} from '../effect-feedback';
import {
  AddFavorite,
  DeleteFavorite,
  FavoritesActionTypes,
  FavoritesLoadError,
  LoadFavorites,
  ToggleFavorite
} from './favorite.actions';

@Injectable()
export class FavoriteEffects {
  @Effect()
  loadFavorites$ = this.dataPersistence.fetch(
    FavoritesActionTypes.LoadFavorites,
    {
      run: (action: LoadFavorites, state: DalState) => {
        if (!action.payload.force && state.favorites.loaded) return;
        // TODO: uncomment when favoriteService exists
        // return this.favoriteService
        //   .getAllForUser(action.payload.userId)
        //   .pipe(map(favorites => new FavoritesLoaded({ favorites })));
      },
      onError: (action: LoadFavorites, error) => {
        return new FavoritesLoadError(error);
      }
    }
  );
  @Effect()
  addFavorite$ = this.dataPersistence.fetch(FavoritesActionTypes.AddFavorite, {
    run: (action: AddFavorite, state: DalState) => {
      // TODO: uncomment when favoriteService exists
      // return this.favoriteService
      //   .addFavorite(action.payload.favorite)
      //   .pipe(map(favorite => new FavoriteActions.AddFavoriteSuccess({ favorite })));
    },
    onError: (action: AddFavorite, error) => {
      const effectFeedback = new EffectFeedback({
        id: this.uuid(),
        triggerAction: action,
        message:
          'Het is niet gelukt om het item aan jouw favorieten toe te voegen.',
        type: 'error',
        userActions: [{ title: 'Opnieuw proberen', userAction: action }],
        display: true,
        priority: Priority.HIGH
      });
      return new EffectFeedbackActions.AddEffectFeedback({ effectFeedback });
    }
  });

  @Effect()
  deleteFavorite$ = this.dataPersistence.optimisticUpdate(
    FavoritesActionTypes.DeleteFavorite,
    {
      run: (action: DeleteFavorite, state: DalState) => {
        // TODO: uncomment when favoriteService exists
        // return this.favoriteService.deleteFavorite(action.payload.id).pipe(
        //   map(() => {
        //     const effectFeedback = new EffectFeedback({
        //       id: this.uuid(),
        //       triggerAction: action,
        //       message: 'Het item is uit jouw favorieten verwijderd.',
        //       type: 'success',
        //       display: true,
        //       priority: Priority.NORM
        //     });
        //     return new EffectFeedbackActions.AddEffectFeedback({
        //       effectFeedback
        //     });
        //   })
        // );
      },
      undoAction: (action: DeleteFavorite, error) => {
        const undoAction = undo(action);
        const effectFeedback = new EffectFeedback({
          id: this.uuid(),
          triggerAction: action,
          message:
            'Het is niet gelukt om het item uit jouw favorieten te verwijderen.',
          type: 'error',
          userActions: [{ title: 'Opnieuw proberen', userAction: action }],
          display: true,
          priority: Priority.HIGH
        });
        const effectFeedbackAction = new EffectFeedbackActions.AddEffectFeedback(
          { effectFeedback }
        );
        return from([undoAction, effectFeedbackAction]);
      }
    }
  );

  @Effect()
  toggleFavorite$ = this.dataPersistence.fetch(
    FavoritesActionTypes.ToggleFavorite,
    {
      run: (action: ToggleFavorite, state: DalState) => {
        if (state.favorites.entities[action.payload.favorite.id]) {
          //  already marked as favorite --> delete it
          return new FavoriteActions.DeleteFavorite({
            id: action.payload.favorite.id
          });
        } else {
          // new favorite --> add it
          return new FavoriteActions.AddFavorite({
            favorite: action.payload.favorite
          });
        }
      },
      onError: (action: ToggleFavorite, error) => {
        return new FavoritesLoadError(error);
      }
    }
  );

  constructor(
    @Inject('uuid') private uuid: Function,
    private actions: Actions,
    private dataPersistence: DataPersistence<DalState> // @Inject(FAVORITE_SERVICE_TOKEN) // private favoriteService: FavoriteServiceInterface
  ) {}
}
