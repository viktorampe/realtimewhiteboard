import { Injectable } from '@angular/core';
import { FavoriteApi, PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { Observable } from 'rxjs';
import { FavoriteInterface } from '../+models';
import { FavoriteServiceInterface } from './favorite.service.interface';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService implements FavoriteServiceInterface {
  constructor(private personApi: PersonApi, private favoriteApi: FavoriteApi) {}

  getAllForUser(userId: number): Observable<FavoriteInterface[]> {
    return this.personApi.getFavorites(userId);
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
