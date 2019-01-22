import { Component, OnInit } from '@angular/core';
import { AlertQueueInterface } from '@campus/dal';
import { Observable } from 'rxjs';

@Component({
  selector: 'campus-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss']
})
export class AlertsComponent implements OnInit {
  pageTitle = 'Meldingen';
  pageIcon = 'notifications';

  alerts$: Observable<AlertQueueInterface[]>;

  constructor() {}

  ngOnInit() {}

  markAsRead(alertId: number) {}

  deleteAlert(alertId: number) {}
}
