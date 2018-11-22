import { Inject, Injectable } from '@angular/core';
import {
  AlertQueueInterface,
  DalState,
  MessageInterface,
  PersonInterface,
  UiActions,
  UserQueries
} from '@campus/dal';
import { BreadcrumbLinkInterface } from '@campus/ui';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import {
  EnvironmentAlertsFeatureInterface,
  ENVIRONMENT_ALERTS_FEATURE_TOKEN
} from '../interfaces/environment.features.interfaces';
import { HeaderResolver } from './header.resolver';
import { MockHeaderViewModel, NotificationItem } from './header.viewmodel.mock';

//TODO replace with actual interface

//TODO replace with actual interface
export interface CurrentRouteInterface {
  label: string;
  url: string;
}

//TODO replace wit actual interface
export interface DropdownItemInterface {
  text: string;
}

@Injectable({
  providedIn: 'root'
})
export class HeaderViewModel {
  //publics
  enableAlerts: boolean;
  //source streams
  breadCrumbs$: Observable<BreadcrumbLinkInterface[]>; // TODO select breadcrumbs from store
  currentUser$: Observable<PersonInterface>;
  //presentation stream
  recentAlerts$: Observable<NotificationItem[]>; //TODO replace interface with the actual dropdown interface
  backLink$: Observable<string | undefined>;

  //state source streams
  private alerts$: Observable<AlertQueueInterface[]>;

  constructor(
    @Inject(ENVIRONMENT_ALERTS_FEATURE_TOKEN)
    private environmentAlertsFeature: EnvironmentAlertsFeatureInterface,
    private store: Store<DalState>,
    private headerResolver: HeaderResolver,
    private mockViewModel: MockHeaderViewModel
  ) {
    this.headerResolver.resolve();
    this.loadFeatureToggles();
    this.loadStateStreams();
    this.backLink$ = this.setupPageBarNavigation(); // TODO: move to loadDisplayStream()
    //TODO remove comment once the states have been added
    //this.loadDisplayStream();
  }

  setAlertAsRead(eventData: any): void {
    //TODO update to correct action and update eventData to correct name and type
    // this.store.dispatch(new AlertQueries.SetReadAlert(eventData.alertId));
  }
  setMessageAsRead(eventData: any): void {
    //TODO update to correct action and update eventData to correct name and type
    // this.store.dispatch(new MessageQueries.SetMessageAsReadAction(eventData.alertId));
  }

  private loadStateStreams(): void {
    //source state streams
    // this.alertsForUser$ = this.store.pipe(
    //   select(AlertQueries.getForUser, { userId: this.authService.userId })
    // );
    // this.messagesForUser$ = this.store.pipe(
    //   select(MessageQueries.getForUser, { userId: this.authService.userId })
    // );
    //presentation state streams
    this.currentUser$ = this.store.pipe(select(UserQueries.getCurrentUser));
    // this.breadCrumbs$ = this.store.pipe(select(BreadCrumbsQueries.getAllLinks));
  }

  private loadDisplayStream(): void {
    this.recentAlerts$ = this.getRecentAlerts(this.alerts$);
    this.recentMessages$ = this.getRecentMessages(this.messagesForUser$);
  }

  private loadFeatureToggles(): void {
    this.enableAlerts =
      this.environmentAlertsFeature.enabled &&
      this.environmentAlertsFeature.hasAppBarDropDown;
    this.enableMessages =
      this.environmentMessagesFeature.enabled &&
      this.environmentMessagesFeature.hasAppBarDropDown;
  }

  private getRecentAlerts(
    alertsForUser$: Observable<AlertQueueInterface[]>
  ): Observable<DropdownItemInterface[]> {
    return alertsForUser$.pipe(
      map(alerts => {
        //TODO actually map to the correct interface
        //TODO there should be a selector for this once all things are merged, see https://github.com/diekeure/campus/issues/175
        return <DropdownItemInterface[]>[
          {
            text: 'temp alert'
          }
        ];
      }),
      shareReplay(1)
    );
  }

  private getRecentMessages(
    messagesForUser$: Observable<MessageInterface[]>
  ): Observable<DropdownItemInterface[]> {
    return messagesForUser$.pipe(
      map(messages => {
        //TODO actually map to the correct interface
        return <DropdownItemInterface[]>[
          {
            text: 'temp message'
          }
        ];
      }),
      shareReplay(1)
    );
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

  toggleSideNav() {
    this.store.dispatch(new UiActions.ToggleSideNav());
  }
}
