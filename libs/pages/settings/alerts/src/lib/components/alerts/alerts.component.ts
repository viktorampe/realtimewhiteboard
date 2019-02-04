import { Component, OnInit } from '@angular/core';
import { AlertToNotificationItemPipe } from '@campus/shared';
import { NotificationItemInterface } from '@campus/ui';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AlertsViewModel } from './alerts.viewmodel';

@Component({
  selector: 'campus-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss']
})
export class AlertsComponent implements OnInit {
  pageTitle = 'Meldingen';
  pageIcon = 'notifications';

  notifications$: Observable<NotificationItemInterface[]>;

  constructor(
    private viewModel: AlertsViewModel,
    alertToNotif: AlertToNotificationItemPipe
  ) {
    this.notifications$ = this.viewModel.alerts$.pipe(
      map(a => a.map(alertToNotif.transform))
    );
  }

  ngOnInit() {}

  setAlertAsRead(alertId: number) {
    this.viewModel.setAlertAsRead(alertId);
  }

  setAlertAsUnread(alertId: number) {
    this.viewModel.setAlertAsUnread(alertId);
  }

  removeAlert(alertId: number) {
    this.viewModel.removeAlert(alertId);
  }
}
