import { Inject, Injectable } from '@angular/core';
import {
  AlertQueueInterface,
  MessageInterface,
  PersonInterface
} from '@campus/dal';
import { Observable } from 'rxjs';
import {
  EnvironmentFeaturesInterface,
  ENVIRONMENT_FEATURES_TOKEN
} from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class HeaderViewModel {
  enableAlerts: boolean;
  enableMessages: boolean;

  currentRoute$: Observable<{ label: string; url: string }[]>; // TODO to be replaced by custom interface once the breadcrumbsComponent is done
  recentAlerts$: Observable<AlertQueueInterface[]>;
  recentMessages$: Observable<MessageInterface[]>;
  currentUser$: Observable<PersonInterface>;

  private breadCrumbs$: Observable<any>;
  private alertsForUser$: Observable<any>;
  private ConversationsForUser$: Observable<any>;
  private Person$: Observable<any>;
  private UiState$: Observable<any>;

  constructor(
    @Inject(ENVIRONMENT_FEATURES_TOKEN)
    private environmentFeatures: EnvironmentFeaturesInterface
  ) {
    this.loadFeatureToggles();
  }

  private loadFeatureToggles() {
    this.enableAlerts =
      this.environmentFeatures.alerts.enabled &&
      this.environmentFeatures.alerts.hasAppBarDropDown;
    this.enableMessages =
      this.environmentFeatures.messages.enabled &&
      this.environmentFeatures.messages.hasAppBarDropDown;
  }
}
