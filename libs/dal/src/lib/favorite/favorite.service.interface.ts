import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { FavoriteInterface } from '../+models';

export const FAVORITE_SERVICE_TOKEN = new InjectionToken('FavoriteService');

// TODO: ticket #426
export interface FavoriteServiceInterface {
  getAllForUser(userId: number): Observable<FavoriteInterface[]>;
  addFavorite(favorite: FavoriteInterface): Observable<FavoriteInterface>;
  deleteFavorite(favoriteId: number): void;
}
