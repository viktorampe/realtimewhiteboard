import { Inject, Injectable } from '@angular/core';
import {
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  DalState,
  EffectFeedbackInterface,
  FavoriteActions,
  FavoriteInterface,
  HistoryInterface
} from '@campus/dal';
import { Update } from '@ngrx/entity';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { QuickLinkTypeEnum } from './quick-link-type.enum';

@Injectable()
export class QuickLinkViewModel {
  public quickLinks$: Observable<HistoryInterface[] | FavoriteInterface[]>;
  public feedback$: Observable<EffectFeedbackInterface>;

  constructor(
    private store: Store<DalState>,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface
  ) {}

  public update(id: number, name: string, mode: QuickLinkTypeEnum): void {
    let action: Action;
    switch (mode) {
      case QuickLinkTypeEnum.FAVORITES:
        const favorite: Update<FavoriteInterface> = {
          id,
          changes: { name }
        };
        action = new FavoriteActions.UpdateFavorite({
          userId: this.authService.userId,
          favorite,
          handleErrorAutomatically: false
        });

        break;
      case QuickLinkTypeEnum.HISTORY:
        // TODO: dispatch update history action if relevant
        throw new Error('no History State yet');
      default:
        return;
    }

    this.store.dispatch(action);
  }
  public delete(id: number, mode: QuickLinkTypeEnum): void {
    let action: Action;
    switch (mode) {
      case QuickLinkTypeEnum.FAVORITES:
        action = new FavoriteActions.DeleteFavorite({
          id: id,
          userId: this.authService.userId
        });
        break;
      case QuickLinkTypeEnum.HISTORY:
        // TODO: dispatch delete history action if relevant
        throw new Error('no History State yet');
      default:
        return;
    }
    this.store.dispatch(action);
  }
}
