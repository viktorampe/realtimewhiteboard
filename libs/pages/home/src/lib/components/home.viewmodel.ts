import { Inject, Injectable } from '@angular/core';
import {
  DalState,
  EduContent,
  FavoriteTypesEnum,
  UserQueries
} from '@campus/dal';
import {
  NavigationItemServiceInterface,
  NAVIGATION_ITEM_SERVICE_TOKEN,
  OpenStaticContentServiceInterface,
  OPEN_STATIC_CONTENT_SERVICE_TOKEN
} from '@campus/shared';
import { NavItem } from '@campus/ui';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  FavoriteMethodWithEduContent,
  getFavoritesWithEduContent
} from './home.viewmodel.selectors';

@Injectable({
  providedIn: 'root'
})
export class HomeViewModel {
  // source streams
  private userPermissions$: Observable<string[]>;

  //Presentation streams
  public displayName$: Observable<string>;
  public favoritesWithEduContent$: Observable<FavoriteMethodWithEduContent[]>;
  public dashboardNavItems$: Observable<NavItem[]>;

  constructor(
    private store: Store<DalState>,
    @Inject(OPEN_STATIC_CONTENT_SERVICE_TOKEN)
    private openStaticContentService: OpenStaticContentServiceInterface,
    @Inject(NAVIGATION_ITEM_SERVICE_TOKEN)
    private navigationItemService: NavigationItemServiceInterface
  ) {
    this.initialize();
  }

  public openBoeke(eduContent: EduContent): void {
    this.openStaticContentService.open(eduContent);
  }

  private initialize() {
    this.setSourceStreams();
    this.setPresentationStreams();
  }

  private setSourceStreams() {
    this.userPermissions$ = this.store.pipe(select(UserQueries.getPermissions));
  }

  private setPresentationStreams(): void {
    this.displayName$ = this.store.pipe(
      select(UserQueries.getCurrentUser),
      map(user => user.firstName || user.displayName)
    );
    this.favoritesWithEduContent$ = this.store.pipe(
      select(getFavoritesWithEduContent, { type: FavoriteTypesEnum.BOEKE })
    );

    this.dashboardNavItems$ = this.userPermissions$.pipe(
      map(permissions => {
        return this.navigationItemService.getNavItemsForTree(
          'dashboardNav',
          permissions
        );
      })
    );
  }
}
