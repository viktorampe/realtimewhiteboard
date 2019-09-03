import { Injectable } from '@angular/core';
import {
  Alert,
  AlertFixture,
  AlertQueueInterface,
  PersonFixture,
  PersonInterface
} from '@campus/dal';
import {
  BreadcrumbLinkFixture,
  BreadcrumbLinkInterface,
  DropdownMenuItemInterface,
  ListFormat
} from '@campus/ui';
import { BehaviorSubject, Observable } from 'rxjs';
import { QuickLinkTypeEnum } from '../quick-link/quick-link-type.enum';

@Injectable({
  providedIn: 'root'
})
export class MockHeaderViewModel {
  // recent alerts fixture
  private alertNotifications: AlertQueueInterface[] = [
    new AlertFixture({
      type: 'lesmateriaal',
      title: 'alert title',
      link: '/linkToAlert',
      message: 'this is an alert',
      sentAt: new Date()
    }),
    new AlertFixture({
      type: 'lesmateriaal',
      title: 'alert title',
      link: '/linkToAlert',
      message: 'this is an alert',
      sentAt: new Date()
    }),
    new AlertFixture({
      type: 'lesmateriaal',
      title: 'alert title',
      link: '/linkToAlert',
      message: 'this is an alert',
      sentAt: new Date()
    })
  ];

  enableAlerts = true;
  profileMenuItems$: Observable<
    DropdownMenuItemInterface[]
  > = new BehaviorSubject([
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
  ]);

  // source streams
  alertsLoaded$ = new BehaviorSubject<boolean>(false);

  breadCrumbs$: Observable<BreadcrumbLinkInterface[]> = new BehaviorSubject<
    BreadcrumbLinkInterface[]
  >([
    new BreadcrumbLinkFixture(),
    new BreadcrumbLinkFixture(),
    new BreadcrumbLinkFixture()
  ]);

  unreadAlerts$: Observable<Alert[]> = new BehaviorSubject<Alert[]>([
    new AlertFixture(),
    new AlertFixture(),
    new AlertFixture({ read: true })
  ]);

  currentUser$: Observable<PersonInterface> = new BehaviorSubject<
    PersonInterface
  >(new PersonFixture());

  listFormat$: Observable<ListFormat> = new BehaviorSubject<ListFormat>(
    ListFormat.GRID
  );

  // intermediate streams

  //presentation stream
  alertNotifications$ = new BehaviorSubject<AlertQueueInterface[]>(
    this.alertNotifications
  );
  unreadAlertCount$ = new BehaviorSubject<number>(0);
  backLink$ = new BehaviorSubject<string | undefined>('');

  toggleSideNav = () => {};

  openDialog(mode: QuickLinkTypeEnum) {}

  constructor() {}
}
