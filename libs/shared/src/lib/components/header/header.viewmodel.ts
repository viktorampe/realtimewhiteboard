import { Inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import {
  Alert,
  AlertActions,
  AlertQueries,
  AlertQueueInterface,
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  DalState,
  PersonInterface,
  UiActions,
  UiQuery,
  UserQueries
} from '@campus/dal';
import { BreadcrumbLinkInterface, DropdownMenuItemInterface } from '@campus/ui';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  ENVIRONMENT_ALERTS_FEATURE_TOKEN,
  ENVIRONMENT_FAVORITES_FEATURE_TOKEN,
  ENVIRONMENT_GLOBAL_SEARCH_FEATURE_TOKEN
} from '../../interfaces/environment.injectiontokens';
import {
  EnvironmentAlertsFeatureInterface,
  EnvironmentFavoritesFeatureInterface,
  EnvironmentGlobalSearchFeatureInterface
} from '../../interfaces/environment.interfaces';
import { QuickLinkTypeEnum } from '../quick-link/quick-link-type.enum';
import { QuickLinkComponent } from '../quick-link/quick-link.component';

@Injectable({
  providedIn: 'root'
})
export class HeaderViewModel {
  // publics
  enableAlerts: boolean;
  enableGlobalSearch: boolean;

  alertsLoaded$: Observable<boolean>;

  // source streams
  breadCrumbs$: Observable<BreadcrumbLinkInterface[]>;
  currentUser$: Observable<PersonInterface>;
  unreadAlerts$: Observable<Alert[]>;

  // presentation stream
  alertNotifications$: Observable<AlertQueueInterface[]>;
  unreadAlertCount$: Observable<number>;
  backLink$: Observable<string[] | undefined>; //TODO: undefined nog nodig?
  profileMenuItems$: Observable<DropdownMenuItemInterface[]>;

  constructor(
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface,
    @Inject(ENVIRONMENT_ALERTS_FEATURE_TOKEN)
    private environmentAlertsFeature: EnvironmentAlertsFeatureInterface,
    @Inject(ENVIRONMENT_GLOBAL_SEARCH_FEATURE_TOKEN)
    private environmentGlobalSearchFeature: EnvironmentGlobalSearchFeatureInterface,
    @Inject(ENVIRONMENT_FAVORITES_FEATURE_TOKEN)
    private environmentFavoritesFeature: EnvironmentFavoritesFeatureInterface,
    private dialog: MatDialog,
    private store: Store<DalState>
  ) {
    this.loadAlertsLoaded();
    this.loadFeatureToggles();
    this.loadStateStreams();
    this.loadDisplayStream();
  }

  private loadAlertsLoaded(): any {
    this.alertsLoaded$ = this.store.pipe(select(AlertQueries.getLoaded));
  }

  private loadStateStreams(): void {
    //source state streams
    this.unreadAlerts$ = this.store.pipe(select(AlertQueries.getUnread));

    //presentation state streams
    this.currentUser$ = this.store.pipe(select(UserQueries.getCurrentUser));
    this.breadCrumbs$ = this.store.pipe(select(UiQuery.getBreadcrumbs));
    this.profileMenuItems$ = this.store.pipe(
      select(UiQuery.getProfileMenuItems)
    );
  }

  private loadDisplayStream(): void {
    this.backLink$ = this.getBackLink();
    this.alertNotifications$ = this.getAlertNotifications();
    this.unreadAlertCount$ = this.getUnreadAlertCount();
  }

  private loadFeatureToggles(): void {
    this.enableAlerts =
      this.environmentAlertsFeature.enabled &&
      this.environmentAlertsFeature.hasAppBarDropDown;

    this.enableGlobalSearch = this.environmentGlobalSearchFeature.enabled;
  }

  private getAlertNotifications(): Observable<AlertQueueInterface[]> {
    return this.unreadAlerts$;
  }

  private getUnreadAlertCount(): Observable<number> {
    return this.unreadAlerts$.pipe(
      map(alerts => {
        return alerts.length;
      })
    );
  }

  private getBackLink(): Observable<string[] | undefined> {
    return this.breadCrumbs$.pipe(
      map((breadCrumbs: BreadcrumbLinkInterface[]) => {
        const check =
          breadCrumbs.length < 2
            ? undefined
            : breadCrumbs[breadCrumbs.length - 2].link;
        return check;
      })
    );
  }

  // user interactions //

  setAlertAsRead(alertId: number): void {
    this.store.dispatch(
      new AlertActions.SetReadAlert({
        alertIds: alertId,
        personId: this.authService.userId,
        read: true
      })
    );
  }

  toggleSideNav() {
    this.store.dispatch(new UiActions.ToggleSideNav());
  }

  openDialog(mode: QuickLinkTypeEnum): void {
    this.dialog.open(QuickLinkComponent, {
      data: {
        mode,
        allowedFavoriteTypes: this.environmentFavoritesFeature
          .allowedFavoriteTypes
      },
      panelClass: 'quick-link__dialog'
    });
  }
}
