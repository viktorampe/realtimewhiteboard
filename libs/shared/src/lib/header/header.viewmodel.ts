import { Inject, Injectable } from '@angular/core';
import {
  AlertQueueInterface,
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  DalState,
  MessageInterface,
  PersonInterface
} from '@campus/dal';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
export class HeaderViewModel {
  enableAlerts: boolean;
  enableMessages: boolean;
  breadCrumbs$: Observable<BreadCrumbLinkInterface[]>; // TODO to be replaced by custom interface once the breadcrumbsComponent is done
  currentUser$: Observable<PersonInterface>;
  recentAlerts$: Observable<DropdownItemInterface>; //TODO replace interface with the actual dropdown interface
  recentMessages$: Observable<DropdownItemInterface[]>; //TODO replace interface with the actual dropdown interface

  //TODO add correct custom interfaces

  private currentRoute$: Observable<CurrentRouteInterface[]>;
  private alertsForUser$: Observable<AlertQueueInterface[]>;
  private MessagesForUser$: Observable<MessageInterface[]>;
  private UiState$: Observable<any>;

  constructor(
    @Inject(ENVIRONMENT_FEATURES_TOKEN)
    private environmentFeatures: EnvironmentFeaturesInterface,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface,
    private store: Store<DalState>
  ) {
    this.loadFeatureToggles();
  }

  //remark: i think these two getters can be removed and replaced by 2 load actions in the resolver
  getNewAlerts() {
    //TODO update to the correct action
    // this.store.dispatch(new AlertQueries.getNewAlerts(this.authService.userId))
  }
  getNewMessages() {
    //TODO update to the correct action
    // this.store.dispatch(new MessageQueries.getNewMessages(this.authService.userId))
  }

  setAlertAsRead(eventData: any) {
    //TODO update to correct action and update eventData to correct name and type
    // this.store.dispatch(new AlertQueries.SetReadAlert(eventData.alertId));
  }
  setMessageAsRead(eventData: any) {
    //TODO update to correct action and update eventData to correct name and type
    // this.store.dispatch(new MessageQueries.SetMessageAsReadAction(eventData.alertId));
  }

  private loadFeatureToggles() {
    this.enableAlerts =
      this.environmentFeatures.alerts.enabled &&
      this.environmentFeatures.alerts.hasAppBarDropDown;
    this.enableMessages =
      this.environmentFeatures.messages.enabled &&
      this.environmentFeatures.messages.hasAppBarDropDown;
  }

  private getbreadCrumbs(
    currentRoute$: Observable<CurrentRouteInterface>
  ): Observable<BreadCrumbLinkInterface[]> {
    return currentRoute$.pipe(
      map(currentRoute => {
        //TODO actually map to the interface
        return <BreadCrumbLinkInterface[]>[
          {
            displayText: 'temp',
            routerLink: '/'
          }
        ];
      })
    );
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
      })
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
      })
    );
  }
}
