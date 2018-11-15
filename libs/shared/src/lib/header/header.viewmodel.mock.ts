import {
  AlertQueueInterface,
  MessageInterface,
  PersonFixture,
  PersonInterface
} from '@campus/dal';
import { BreadcrumbLinkInterface } from '@campus/ui';
import { BehaviorSubject } from 'rxjs';
import { DropdownItemInterface } from './header.viewmodel';

export class MockViewModel {
  enableAlerts = false;
  enableMessages = false;
  //state presentation streams
  breadCrumbs$ = new BehaviorSubject<BreadcrumbLinkInterface[]>([]);
  currentUser$ = new BehaviorSubject<PersonInterface>(new PersonFixture());
  //presentation stream
  recentAlerts$ = new BehaviorSubject<DropdownItemInterface[]>([]);
  recentMessages$ = new BehaviorSubject<DropdownItemInterface[]>([]);
  backLink$ = new BehaviorSubject<string | undefined>(undefined);

  //state source streams
  private alertsForUser$ = new BehaviorSubject<AlertQueueInterface[]>([]);
  private messagesForUser$ = new BehaviorSubject<MessageInterface[]>([]);
  toggleSideNav = jest.fn();
}
