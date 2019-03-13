import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FavoriteInterface } from '../+models';
import { FavoriteServiceInterface } from './favorite.service.interface';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService implements FavoriteServiceInterface {
  getAllForUser(userId: number): Observable<FavoriteInterface[]> {
    return;
  }
  addFavorite(
    userId: number,
    favorite: FavoriteInterface
  ): Observable<FavoriteInterface> {
    return;
  }
  removeFavorite(userId: number, favoriteId: number) {
    return;
  }
}
