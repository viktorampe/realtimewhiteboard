import { Inject, Injectable } from '@angular/core';
import {
  AlertActions,
  AlertQueries,
  AlertQueueInterface,
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  DalState,
  PersonInterface,
  UiActions,
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
  profileMenuItems: DropdownMenuItemInterface[] = [
    {
      icon: '',
      description: 'Profiel',
      internalLink: '/profile'
    },
    {
      icon: '',
      description: 'Afmelden',
      internalLink: '/logout'
    }
  ];

  // source streams
  breadCrumbs$: Observable<BreadcrumbLinkInterface[]>; // TODO select breadcrumbs from store
  currentUser$: Observable<PersonInterface>;
  private unreadAlerts$: Observable<AlertQueueInterface[]>;

  // presentation stream
  alertNotifications$: Observable<NotificationItemInterface[]>;
  unreadAlertCount$: Observable<number>;
  backLink$: Observable<string | undefined>;

  constructor(
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface,
    @Inject(ENVIRONMENT_ALERTS_FEATURE_TOKEN)
    private environmentAlertsFeature: EnvironmentAlertsFeatureInterface,
    private store: Store<DalState>,
    private headerResolver: HeaderResolver,
    private mockViewModel: MockHeaderViewModel // TODO: remove when all data is available
  ) {
    this.loadResolver();
    this.loadFeatureToggles();
    this.loadStateStreams();
    this.loadDisplayStream();
  }

  loadResolver() {
    this.isResolved$ = this.headerResolver.resolve().pipe(shareReplay(1));
  }

  private loadStateStreams(): void {
    //source state streams
    this.unreadAlerts$ = this.store.pipe(
      select(AlertQueries.getUnread, { userId: this.authService.userId })
    );

    //presentation state streams
    this.currentUser$ = this.store.pipe(select(UserQueries.getCurrentUser));
    // this.breadCrumbs$ = this.store.pipe(select(BreadCrumbsQueries.getAllLinks));
    this.breadCrumbs$ = this.mockViewModel.breadCrumbs$; //TODO: remove when breadcrumbs state is available
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
        return alerts.map(alert => {
          const notification: NotificationItemInterface = {
            icon: 'lesmateriaal', // TODO: depends on the alert.type
            titleText: alert.title,
            person: {
              displayName: 'To be checked' //TODO: check if this is correct
            },
            link: alert.title,
            notificationText: alert.message,
            notificationDate: alert.sentAt,
            accented: true
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
        return breadCrumbs.length < 2
          ? undefined
          : breadCrumbs[breadCrumbs.length - 2].link.toString();
      })
    );
  }

  // user interactions

  setAlertAsRead(alertId: number): void {
    //TODO update to correct action and update eventData to correct name and type
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
