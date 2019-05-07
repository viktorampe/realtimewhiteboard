import { Injectable } from '@angular/core';
import {
  EffectFeedbackInterface,
  FavoriteInterface,
  HistoryInterface
} from '@campus/dal';
import { Observable } from 'rxjs';
import { QuickLinkTypeEnum } from './quick-link-type.enum';

@Injectable({
  providedIn: 'root'
})
export class QuickLinkViewModel {
  public quickLinks$: Observable<HistoryInterface[] | FavoriteInterface[]>;
  public feedback$: Observable<EffectFeedbackInterface>;
  public update(id: number, name: string, mode: QuickLinkTypeEnum): void {}
  public delete(id: number, mode: QuickLinkTypeEnum): void {}
}
