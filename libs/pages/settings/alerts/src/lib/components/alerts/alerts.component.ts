import { Component, OnInit } from '@angular/core';
import { NotificationItemInterface } from '@campus/ui';
import { Observable } from 'rxjs';
import { AlertsViewModel } from './alerts.viewmodel';

@Component({
  selector: 'campus-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss']
})
export class AlertsComponent implements OnInit {
  pageTitle = 'Meldingen';
  pageIcon = 'notifications';

  alerts$: Observable<NotificationItemInterface[]> = this.viewModel.alerts$;

  constructor(private viewModel: AlertsViewModel) {}

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
