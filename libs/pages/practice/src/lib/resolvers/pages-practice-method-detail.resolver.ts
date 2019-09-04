import { Inject, Injectable } from '@angular/core';
import {
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  DalState,
  StateResolver
} from '@campus/dal';
import { Action, Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class PracticeMethodDetailResolver extends StateResolver {
  constructor(
    private store: Store<DalState>,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface
  ) {
    super(store);
  }
  protected getLoadableActions(): Action[] {
    const userId = this.authService.userId;
    return [];
  }

  protected getResolvedQueries() {
    return [];
  }
}
