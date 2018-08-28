import { Component } from '@angular/core';
import { AlertsViewModel } from './alerts.viewmodel';

@Component({
  selector: 'campus-alerts-component',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss']
})
export class AlertsComponent {
  constructor(private alertsViewModel: AlertsViewModel) {}

  //TODO add code
}
