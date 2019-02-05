import { Injectable } from '@angular/core';
import { AlertFixture, AlertQueueInterface } from '@campus/dal';
import { ViewModelInterface } from '@campus/testing';
import { BehaviorSubject, Observable } from 'rxjs';
import { AlertsViewModel } from './alerts.viewmodel';

@Injectable({
  providedIn: 'root'
})
export class MockAlertsViewModel
  implements ViewModelInterface<AlertsViewModel> {
  public alerts$: Observable<AlertQueueInterface[]>; //TODO -- update this once the interface/pipe implementation is done for issue https://github.com/diekeure/campus/issues/510

  constructor() {
    this.setPresentationStreams();
  }

  public setAlertAsRead(alertId: number): void {}

  public setAlertAsUnread(alertId: number): void {}

  public removeAlert(alertId: number): void {}

  private setPresentationStreams(): void {
    const mockAlerts = [
      new AlertFixture({
        id: 1,
        message:
          'This is your captain speaking. We are experiencing some slight turbulence. Unfortunatly, this airplane is held together with ducttape and will surely crash. Please put your head between your legs and kiss your ass goodbye.'
      }),
      new AlertFixture({
        id: 2,
        message: 'This is a much shorter message'
      })
    ];
    this.alerts$ = new BehaviorSubject<AlertQueueInterface[]>(mockAlerts);
  }
}
