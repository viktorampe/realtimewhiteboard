import { Inject, Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import {
  EnvironmentFeaturesInterface,
  ENVIRONMENT_FEATURES_TOKEN
} from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class HeaderViewModel implements Resolve<boolean> {
  enableAlerts: boolean;
  enableMessages: boolean;

  constructor(
    @Inject(ENVIRONMENT_FEATURES_TOKEN)
    private environmentFeatures: EnvironmentFeaturesInterface
  ) {
    this.loadFeatureToggles();
  }

  resolve(): Observable<boolean> {
    return new BehaviorSubject<boolean>(true).pipe(take(1));
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
