import { Injectable } from '@angular/core';
import { DalState, FavoriteTypesEnum } from '@campus/dal';
import { select, Store } from '@ngrx/store';
import { getFavoritesWithEduContent } from './home.viewmodel.selectors';

@Injectable({
  providedIn: 'root'
})
export class HomeViewModel {
  constructor(private store: Store<DalState>) {
    this.store
      .pipe(
        select(getFavoritesWithEduContent, { type: FavoriteTypesEnum.BOEKE })
      )
      .subscribe(console.log);
  }
}
