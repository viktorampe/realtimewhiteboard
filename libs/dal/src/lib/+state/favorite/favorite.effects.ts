import { Inject, Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { select } from '@ngrx/store';
import { DataPersistence } from '@nrwl/nx';
import { undo } from 'ngrx-undo';
import { from, Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { DalState } from '..';
import {
  FavoriteServiceInterface,
  FAVORITE_SERVICE_TOKEN
} from '../../favorite/favorite.service.interface';
import { AuthServiceInterface, AUTH_SERVICE_TOKEN } from '../../persons';
import {
  EffectFeedback,
  EffectFeedbackActions,
  Priority
} from '../effect-feedback';
import {
  AddFavorite,
  DeleteFavorite,
  FavoritesActionTypes,
  FavoritesLoaded,
  FavoritesLoadError,
  LoadFavorites,
  StartAddFavorite,
  ToggleFavorite
} from './favorite.actions';
import { getByTypeAndId } from './favorite.selectors';

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
  startAddFavorite$ = this.dataPersistence.pessimisticUpdate(
    FavoritesActionTypes.StartAddFavorite,
    {
      run: (action: StartAddFavorite, state: DalState) => {
        return this.favoriteService
          .addFavorite(action.payload.userId, action.payload.favorite)
          .pipe(map(favorite => new AddFavorite({ favorite })));
      },
      onError: (action: StartAddFavorite, error) => {
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
    }
  );

  @Effect()
  deleteFavorite$ = this.dataPersistence.optimisticUpdate(
    FavoritesActionTypes.DeleteFavorite,
    {
      run: (action: DeleteFavorite, state: DalState) => {
        return this.favoriteService
          .deleteFavorite(action.payload.userId, action.payload.id)
          .pipe(
            map(() => {
              const effectFeedback = EffectFeedback.generateSuccessFeedback(
                this.uuid(),
                action,
                'Het item is uit jouw favorieten verwijderd.'
              );
              return new EffectFeedbackActions.AddEffectFeedback({
                effectFeedback
              });
            })
          );
      },
      undoAction: (action: DeleteFavorite, error) => {
        const undoAction = undo(action);
        const effectFeedback = EffectFeedback.generateErrorFeedback(
          this.uuid(),
          action,
          'Het is niet gelukt om het item uit jouw favorieten te verwijderen.'
        );
        const effectFeedbackAction = new EffectFeedbackActions.AddEffectFeedback(
          { effectFeedback }
        );
        return from([undoAction, effectFeedbackAction]);
      }
    }
  );

  @Effect()
  toggleFavorite$ = this.dataPersistence.actions.pipe(
    ofType(FavoritesActionTypes.ToggleFavorite),
    switchMap(
      (
        action: ToggleFavorite
      ): Observable<StartAddFavorite | DeleteFavorite> => {
        return this.dataPersistence.store.pipe(
          select(getByTypeAndId, {
            type: action.payload.favorite.type,
            id:
              action.payload.favorite.eduContentId ||
              action.payload.favorite.bundleId ||
              action.payload.favorite.taskId ||
              action.payload.favorite.learningAreaId
          }),
          take(1),
          map(favorite => {
            if (favorite) {
              return new DeleteFavorite({
                id: favorite.id,
                userId: this.authService.userId
              });
            } else {
              return new StartAddFavorite({
                favorite: action.payload.favorite,
                userId: this.authService.userId
              });
            }
          })
        );
      }
    )
  );

  constructor(
    @Inject('uuid') private uuid: Function,
    private actions: Actions,
    private dataPersistence: DataPersistence<DalState>,
    @Inject(FAVORITE_SERVICE_TOKEN)
    private favoriteService: FavoriteServiceInterface,
    @Inject(AUTH_SERVICE_TOKEN)
    private authService: AuthServiceInterface
  ) {}
}
