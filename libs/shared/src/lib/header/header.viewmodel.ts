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
import { StateResolver, StateResolverInterface } from '@campus/pages/shared';
import { Action, select, Selector, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import {
  EnvironmentFeaturesInterface,
  ENVIRONMENT_FEATURES_TOKEN
} from '../interfaces';

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
export class HeaderViewModel implements StateResolverInterface {
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
    private stateResolver: StateResolver,
    @Inject(ENVIRONMENT_FEATURES_TOKEN)
    private environmentFeatures: EnvironmentFeaturesInterface,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface,
    private store: Store<DalState>
  ) {}

  resolve(): Observable<boolean> {
    this.loadStateStreams();
    this.loadDisplayStream();
    this.loadFeatureToggles();
    return this.stateResolver.resolve(
      this.getLoadableActions(),
      this.getResolvedQueries()
    );
  }

  getLoadableActions(): Action[] {
    return [
      // TODO add load actions, eg. new LearningAreaActions.LoadLearningAreas()
    ];
  }

  getResolvedQueries(): Selector<object, boolean>[] {
    return [
      // TODO add loaded queries, eg. LearningAreaQueries.getLoaded
    ];
  }

  //remark: i think these two getters can be removed and replaced by 2 load actions in the resolver
  getNewAlerts(): void {
    //TODO update to the correct action
    // this.store.dispatch(new AlertQueries.getNewAlerts(this.authService.userId))
  }
  getNewMessages(): void {
    //TODO update to the correct action
    // this.store.dispatch(new MessageQueries.getNewMessages(this.authService.userId))
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
      this.environmentFeatures.alerts.enabled &&
      this.environmentFeatures.alerts.hasAppBarDropDown;
    this.enableMessages =
      this.environmentFeatures.messages.enabled &&
      this.environmentFeatures.messages.hasAppBarDropDown;
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
