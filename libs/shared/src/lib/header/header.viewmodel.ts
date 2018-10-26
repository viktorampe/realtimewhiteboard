import { Inject, Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import {
  EnvironmentAlertsFeatureInterface,
  EnvironmentMessagesFeatureInterface,
  ENVIRONMENT_ALERTS_FEATURE_TOKEN,
  ENVIRONMENT_MESSAGES_FEATURE_TOKEN
} from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class HeaderViewModel implements Resolve<boolean> {
  enableAlerts: boolean;
  enableMessages: boolean;

  constructor(
    @Inject(ENVIRONMENT_ALERTS_FEATURE_TOKEN)
    private environmentAlertsFeature: EnvironmentAlertsFeatureInterface,
    @Inject(ENVIRONMENT_MESSAGES_FEATURE_TOKEN)
    private environmentMessagesFeature: EnvironmentMessagesFeatureInterface
  ) {
    this.loadFeatureToggles();
  }

  resolve(): Observable<boolean> {
    return new BehaviorSubject<boolean>(true).pipe(take(1));
  }
  private loadFeatureToggles() {
    this.enableAlerts =
      this.environmentAlertsFeature.enabled &&
      this.environmentAlertsFeature.hasAppBarDropDown;
    this.enableMessages =
      this.environmentMessagesFeature.enabled &&
      this.environmentMessagesFeature.hasAppBarDropDown;
  }
}
