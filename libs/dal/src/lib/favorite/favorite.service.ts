import { Injectable } from '@angular/core';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { Observable } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { FavoriteInterface } from '../+models';
import { FavoriteServiceInterface } from './favorite.service.interface';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService implements FavoriteServiceInterface {
  constructor(private personApi: PersonApi) {}

  getAllForUser(userId: number): Observable<FavoriteInterface[]> {
    return this.personApi.getFavorites(userId);
  }

  addFavorite(
    userId: number,
    favorite: FavoriteInterface
  ): Observable<FavoriteInterface> {
    // note: will soft delete every other favorite with
    // the same type and relationId (e.g. learningAreaId)
    return this.personApi.createFavorites(userId, favorite);
  }

  updateFavorite(
    userId: number,
    favorite: FavoriteInterface
  ): Observable<FavoriteInterface> {
    return this.personApi.updateByIdFavorites(userId, favorite.id, favorite);
  }

  deleteFavorite(userId: number, favoriteId: number): Observable<boolean> {
    return this.personApi
      .destroyByIdFavorites(userId, favoriteId)
      .pipe(mapTo(true));
  }
}
