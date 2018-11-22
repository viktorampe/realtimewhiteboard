import { Injectable } from '@angular/core';
import {
  AlertFixture,
  AlertQueueInterface,
  BreadcrumbFixture,
  PersonFixture,
  PersonInterface
} from '@campus/dal';
import {
  BadgePersonInterface,
  BreadcrumbLinkInterface,
  ListFormat
} from '@campus/ui';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface NotificationItemInterface {
  icon: string;
  person: BadgePersonInterface;
  titleText: string;
  link: string;
  notificationText: string;
  notificationDate: Date;
  accented: boolean;
}
@Injectable({
  providedIn: 'root'
})
export class MockHeaderViewModel {
  enableAlerts = true;

  // source streams
  breadCrumbs$: Observable<BreadcrumbLinkInterface[]> = new BehaviorSubject<
    BreadcrumbLinkInterface[]
  >([
    new BreadcrumbFixture(),
    new BreadcrumbFixture(),
    new BreadcrumbFixture()
  ]);

  alerts$: Observable<AlertQueueInterface[]> = new BehaviorSubject<
    AlertQueueInterface[]
  >([new AlertFixture(), new AlertFixture(), new AlertFixture({ read: true })]);

  currentUser$: Observable<PersonInterface> = new BehaviorSubject<
    PersonInterface
  >(new PersonFixture());

  listFormat$: Observable<ListFormat> = new BehaviorSubject<ListFormat>(
    ListFormat.GRID
  );

  // intermediate streams

  //presentation stream
  recentAlerts$: Observable<NotificationItemInterface[]>;
  recentAlertCount$: Observable<number>;
  backLink$: Observable<string | undefined>;

  toggleSideNav = () => {};

  constructor() {
    this.backLink$ = this.setupPageBarNavigation();
    this.recentAlerts$ = this.setupRecentAlerts();
    this.recentAlertCount$ = this.setupRecentAlertCount();
  }

  setupPageBarNavigation(): Observable<string | undefined> {
    return this.breadCrumbs$.pipe(
      map((breadCrumbs: BreadcrumbLinkInterface[]) => {
        return breadCrumbs.length < 2
          ? undefined
          : breadCrumbs[breadCrumbs.length - 2].link.toString();
      })
    );
  }

  setupRecentAlerts(): Observable<NotificationItemInterface[]> {
    return combineLatest(this.alerts$, this.currentUser$).pipe(
      map(([alerts, user]) => {
        return alerts.filter(alert => !alert.read).map(alert => {
          const notification: NotificationItemInterface = {
            icon: 'alert',
            titleText: alert.title,
            person: {
              displayName: user.displayName
            },
            link: alert.title,
            notificationText: alert.message,
            notificationDate: alert.sentAt,
            accented: true
          };
          return notification;
        });
      })
    );
  }

  setupRecentAlertCount(): Observable<number> {
    return this.recentAlerts$.pipe(
      map(alerts => {
        return alerts.length;
      })
    );
  }
}
