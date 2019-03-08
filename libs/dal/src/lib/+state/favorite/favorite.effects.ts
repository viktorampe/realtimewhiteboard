import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { undo } from 'ngrx-undo';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { DalState } from '..';
import {
  FavoriteServiceInterface,
  FAVORITE_SERVICE_TOKEN
} from '../../favorite/favorite.service.interface';
import {
  EffectFeedback,
  EffectFeedbackActions,
  Priority
} from '../effect-feedback';
import {
  AddFavorite,
  AddFavoriteSuccess,
  DeleteFavorite,
  FavoritesActionTypes,
  FavoritesLoaded,
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

        return this.favoriteService
          .getAllForUser(action.payload.userId)
          .pipe(map(favorites => new FavoritesLoaded({ favorites })));
      },
      onError: (action: LoadFavorites, error) => {
        return new FavoritesLoadError(error);
      }
    }
  );
  @Effect()
  addFavorite$ = this.dataPersistence.fetch(FavoritesActionTypes.AddFavorite, {
    run: (action: AddFavorite, state: DalState) => {
      return this.favoriteService
        .addFavorite(action.payload.favorite)
        .pipe(map(favorite => new AddFavoriteSuccess({ favorite })));
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
        return this.favoriteService.deleteFavorite(action.payload.id).pipe(
          map(() => {
            const effectFeedback = new EffectFeedback({
              id: this.uuid(),
              triggerAction: action,
              message: 'Het item is uit jouw favorieten verwijderd.',
              type: 'success',
              display: true,
              priority: Priority.NORM
            });
            return new EffectFeedbackActions.AddEffectFeedback({
              effectFeedback
            });
          })
        );
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
        //  decide if we want to add or delete the provided item
        // dispatch the right action
      },
      onError: (action: ToggleFavorite, error) => {
        return new FavoritesLoadError(error);
      }
    }
  );

  constructor(
    @Inject('uuid') private uuid: Function,
    private actions: Actions,
    private dataPersistence: DataPersistence<DalState>,
    @Inject(FAVORITE_SERVICE_TOKEN)
    private favoriteService: FavoriteServiceInterface
  ) {}
}
