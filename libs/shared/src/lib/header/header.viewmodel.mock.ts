import {
  AlertQueueInterface,
  MessageInterface,
  PersonInterface
} from '@campus/dal';
import { BreadcrumbLinkInterface } from '@campus/ui';
import { BehaviorSubject, Observable } from 'rxjs';
import { DropdownItemInterface, mockBreadCrumbs } from './header.viewmodel';

export class MockViewModel {
  enableAlerts = false;
  enableMessages = false;
  //state presentation streams
  breadCrumbs$ = new BehaviorSubject<BreadcrumbLinkInterface[]>(
    mockBreadCrumbs
  );
  currentUser$ = new BehaviorSubject<PersonInterface>();
  //presentation stream
  recentAlerts$: Observable<DropdownItemInterface[]>; //TODO replace interface with the actual dropdown interface
  recentMessages$: Observable<DropdownItemInterface[]>; //TODO replace interface with the actual dropdown interface
  backLink$: Observable<string | undefined> = this.setupPageBarNavigation();

  //state source streams
  private alertsForUser$: Observable<AlertQueueInterface[]>;
  private messagesForUser$: Observable<MessageInterface[]>;
}
