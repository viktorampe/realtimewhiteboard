import { Injectable } from '@angular/core';
import {
  AlertFixture,
  AlertQueueInterface,
  BreadcrumbLinkFixture,
  PersonFixture,
  PersonInterface
} from '@campus/dal';
import {
  BreadcrumbLinkInterface,
  DropdownMenuItemInterface,
  ListFormat,
  NotificationItemInterface
} from '@campus/ui';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MockHeaderViewModel {
  // recent alerts fixture
  private alertNotifications: NotificationItemInterface[] = [
    {
      icon: 'lesmateriaal',
      titleText: 'alert title',
      link: '/linkToAlert',
      notificationText: 'this is an alert',
      notificationDate: new Date()
    },
    {
      icon: 'lesmateriaal',
      titleText: 'alert title',
      link: '/linkToAlert',
      notificationText: 'this is an alert',
      notificationDate: new Date()
    },
    {
      icon: 'lesmateriaal',
      titleText: 'alert title',
      link: '/linkToAlert',
      notificationText: 'this is an alert',
      notificationDate: new Date()
    }
  ];

  enableAlerts = true;
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
  isResolved$ = new BehaviorSubject<boolean>(false);

  breadCrumbs$: Observable<BreadcrumbLinkInterface[]> = new BehaviorSubject<
    BreadcrumbLinkInterface[]
  >([
    new BreadcrumbLinkFixture(),
    new BreadcrumbLinkFixture(),
    new BreadcrumbLinkFixture()
  ]);

  unreadAlerts$: Observable<AlertQueueInterface[]> = new BehaviorSubject<
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
  alertNotifications$ = new BehaviorSubject<NotificationItemInterface[]>(
    this.alertNotifications
  );
  unreadAlertCount$ = new BehaviorSubject<number>(0);
  backLink$ = new BehaviorSubject<string | undefined>('');

  toggleSideNav = () => {};

  constructor() {}
}
