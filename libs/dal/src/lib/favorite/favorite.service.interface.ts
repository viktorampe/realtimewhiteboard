import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { FavoriteInterface } from '../+models';

export const FAVORITE_SERVICE_TOKEN = new InjectionToken('FavoriteService');

export interface FavoriteServiceInterface {
  getAllForUser(userId: number): Observable<FavoriteInterface[]>;
  addFavorite(
    userId: number,
    favorite: FavoriteInterface
  ): Observable<FavoriteInterface>;
  updateFavorite(
    userId: number,
    favorite: FavoriteInterface
  ): Observable<FavoriteInterface>;
  deleteFavorite(userId: number, favoriteId: number): Observable<boolean>;
}
