import { Component, OnInit } from '@angular/core';
import { AlertQueueInterface } from '@campus/dal';
import { Observable } from 'rxjs';
import { MockAlertsViewModel } from './alerts.viewmodel.mock';

@Component({
  selector: 'campus-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss']
})
export class AlertsComponent implements OnInit {
  pageTitle = 'Meldingen';
  pageIcon = 'notifications';

  alerts$: Observable<AlertQueueInterface[]> = this.viewModel.alerts$;

  constructor(private viewModel: MockAlertsViewModel) {}

  ngOnInit() {}

  setAlertAsRead(alertId: number) {
    this.viewModel.setAlertAsRead(alertId);
  }

  removeAlert(alertId: number) {
    this.viewModel.removeAlert(alertId);
  }
}
