import { Injectable } from '@angular/core';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { Observable } from 'rxjs';
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

  removeFavorite(userId: number, favoriteId: number): void {
    this.personApi.destroyByIdFavorites(userId, favoriteId);
  }
}
