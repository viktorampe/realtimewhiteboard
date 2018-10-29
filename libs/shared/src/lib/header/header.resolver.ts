import { StateResolver } from '@campus/dal';
import { Action, Selector } from '@ngrx/store';

export class HeaderResolver extends StateResolver {
  protected getLoadableActions(): Action[] {
    return [];
  }
  protected getResolvedQueries(): Selector<object, boolean>[] {
    return [];
  }
}
