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
  unreadAlerts$: Observable<AlertQueueInterface[]>;

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
    this.isResolved$ = this.headerResolver.resolve();
  }

  private loadStateStreams(): void {
    //source state streams
    this.unreadAlerts$ = this.store.pipe(select(AlertQueries.getUnread));

    //presentation state streams
    this.currentUser$ = this.store.pipe(select(UserQueries.getCurrentUser));
    // this.breadCrumbs$ = this.store.pipe(select(BreadCrumbsQueries.getAllLinks)); // TODO: uncomment when breadcrumbs state is available
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
        return alerts.filter(alert => alert.type !== 'message').map(alert => {
          const notification: NotificationItemInterface = {
            icon: this.getAlertIcon(alert.type),
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
        return breadCrumbs.length < 2
          ? undefined
          : breadCrumbs[breadCrumbs.length - 2].link.toString();
      })
    );
  }

  private getAlertIcon(type: string): string {
    switch (type) {
      case 'educontent':
        return 'polpo-lesmateriaal';

      case 'message':
        return 'icon-envelope-open';

      case 'bundle':
        return 'polpo-lesmateriaal';

      case 'task':
      case 'task-start':
      case 'task-end':
        return 'polpo-tasks';

      case 'boek-e':
        return 'polpo-book';

      case 'marketing':
        return 'polpo-polpo';

      default:
        return 'icon-bell';
    }
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
