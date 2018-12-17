import { Inject, Injectable } from '@angular/core';
import {
  Alert,
  AlertActions,
  AlertQueries,
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  DalState,
  PersonInterface,
  UiActions,
  UiQuery,
  UserQueries
} from '@campus/dal';
import {
  BreadcrumbLinkInterface,
  DropdownMenuItemInterface,
  NotificationItemInterface
} from '@campus/ui';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import {
  EnvironmentAlertsFeatureInterface,
  ENVIRONMENT_ALERTS_FEATURE_TOKEN
} from '../interfaces/environment.features.interfaces';
import { BreadcrumbsService } from './../services/breadcrumbs.service';
import { HeaderResolver } from './header.resolver';
import { MockHeaderViewModel } from './header.viewmodel.mock';

@Injectable({
  providedIn: 'root'
})
export class HeaderViewModel {
  // resolver check
  isResolved$: Observable<boolean>;

  // publics
  enableAlerts: boolean;

  // source streams
  breadCrumbs$: Observable<BreadcrumbLinkInterface[]>; // TODO select breadcrumbs from store
  currentUser$: Observable<PersonInterface>;
  unreadAlerts$: Observable<Alert[]>;

  // presentation stream
  alertNotifications$: Observable<NotificationItemInterface[]>;
  unreadAlertCount$: Observable<number>;
  backLink$: Observable<string | undefined>;
  profileMenuItems$: Observable<DropdownMenuItemInterface[]>;

  constructor(
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface,
    @Inject(ENVIRONMENT_ALERTS_FEATURE_TOKEN)
    private environmentAlertsFeature: EnvironmentAlertsFeatureInterface,
    private store: Store<DalState>,
    private headerResolver: HeaderResolver,
    private mockViewModel: MockHeaderViewModel, // TODO: remove when all data is available
    private breadcrumbService: BreadcrumbsService
  ) {
    this.loadResolver();
    this.loadFeatureToggles();
    this.loadStateStreams();
    this.loadDisplayStream();
  }

  private loadResolver() {
    this.isResolved$ = this.headerResolver.resolve();
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
  }

  private getAlertNotifications(): Observable<NotificationItemInterface[]> {
    return this.unreadAlerts$.pipe(
      map(alerts => {
        return alerts
          .filter(alert => alert.type !== 'message')
          .map(alert => {
            const notification: NotificationItemInterface = {
              icon: alert.icon,
              titleText: alert.title,
              link: alert.link, // TODO: check the link format (external or internal)
              notificationText: alert.message,
              notificationDate: new Date(alert.sentAt)
            };
            return notification;
          });
      }),
      shareReplay(1)
    );
  }

  private getUnreadAlertCount(): Observable<number> {
    return this.unreadAlerts$.pipe(
      map(alerts => {
        return alerts.length;
      })
    );
  }

  private getBackLink(): Observable<string | undefined> {
    return this.breadCrumbs$.pipe(
      map((breadCrumbs: BreadcrumbLinkInterface[]) => {
        const check =
          breadCrumbs.length < 2
            ? undefined
            : breadCrumbs[breadCrumbs.length - 2].link.toString();
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
}
