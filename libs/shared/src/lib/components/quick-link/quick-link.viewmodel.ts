import { Injectable } from '@angular/core';
import {
  DalState,
  EduContent,
  EduContentQueries,
  EffectFeedbackInterface,
  FavoriteInterface,
  FavoriteQueries,
  HistoryInterface,
  LearningAreaQueries
} from '@campus/dal';
import { Dictionary } from '@ngrx/entity';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { QuickLinkTypeEnum } from './quick-link-type.enum';

@Injectable()
export class QuickLinkViewModel {
  public quickLinks$: Observable<HistoryInterface[] | FavoriteInterface[]>;
  public feedback$: Observable<EffectFeedbackInterface>;
  public update(id: number, name: string, mode: QuickLinkTypeEnum): void {}
  public delete(id: number, mode: QuickLinkTypeEnum): void {}

  constructor(private store: Store<DalState>) {}

  private getFavoriteQuickLink$(): Observable<FavoriteInterface[]> {
    return combineLatest(
      this.store.pipe(select(LearningAreaQueries.getAllEntities)),
      this.store.pipe(select(FavoriteQueries.getAll)),
      this.store.pipe(
        select(EduContentQueries.getAllEntities),
        map(object => object as Dictionary<EduContent>)
      )
    ).pipe(
      map(([learningAreaDict, favorites, eduContentDict]) => {
        favorites.forEach(fav => {
          fav.learningArea = learningAreaDict[fav.learningAreaId];
        });
        return favorites;
      })
    );
  }
}
