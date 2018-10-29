import { Inject, Injectable } from '@angular/core';
import {
  AlertQueueInterface,
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  DalState,
  MessageInterface,
  PersonInterface,
  UserQueries
} from '@campus/dal';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import {
  EnvironmentAlertsFeatureInterface,
  EnvironmentMessagesFeatureInterface,
  ENVIRONMENT_ALERTS_FEATURE_TOKEN,
  ENVIRONMENT_MESSAGES_FEATURE_TOKEN
} from '../interfaces';
import { HeaderResolver } from './header.resolver';

//TODO replace with actual interface
export interface BreadCrumbLinkInterface {
  displayText: String;
  routerLink: String;
}

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
  enableMessages: boolean;
  //state presentation streams
  breadCrumbs$: Observable<BreadCrumbLinkInterface[]>; // TODO to be replaced by custom interface once the breadcrumbsComponent is done
  currentUser$: Observable<PersonInterface>;
  //presentation stream
  recentAlerts$: Observable<DropdownItemInterface[]>; //TODO replace interface with the actual dropdown interface
  recentMessages$: Observable<DropdownItemInterface[]>; //TODO replace interface with the actual dropdown interface
  //state source streams
  private alertsForUser$: Observable<AlertQueueInterface[]>;
  private messagesForUser$: Observable<MessageInterface[]>;

  constructor(
    @Inject(ENVIRONMENT_ALERTS_FEATURE_TOKEN)
    private environmentAlertsFeature: EnvironmentAlertsFeatureInterface,
    @Inject(ENVIRONMENT_MESSAGES_FEATURE_TOKEN)
    private environmentMessagesFeature: EnvironmentMessagesFeatureInterface,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface,
    private store: Store<DalState>,
    private headerResolver: HeaderResolver
  ) {
    this.headerResolver.resolve();
    this.loadStateStreams();
    this.loadDisplayStream();
    this.loadFeatureToggles();
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
    this.recentAlerts$ = this.getRecentAlerts(this.alertsForUser$);
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
}
