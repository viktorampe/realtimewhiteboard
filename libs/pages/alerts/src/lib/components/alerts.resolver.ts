import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { AlertsViewModel } from './alerts.viewmodel';

@Injectable()
export class AlertsResolver implements Resolve<boolean> {
  constructor(private alertsViewModel: AlertsViewModel) {}

  resolve(): Observable<boolean> {
    return this.alertsViewModel.initialize().pipe(take(1));
  }
}
