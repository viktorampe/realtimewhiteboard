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
  removeFavorite(userId: number, favoriteId: number);
}

export enum FavoriteTypeEnum {
  'AREA' = 'area',
  'SEARCH' = 'search',
  'EDUCONTENT' = 'educontent',
  'BUNDLE' = 'bundle',
  'TASK' = 'task',
  'BOEK-E' = 'boek-e'
}
