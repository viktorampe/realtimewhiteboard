import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { ReportsViewModel } from './reports.viewmodel';

@Injectable()
export class ReportsResolver implements Resolve<boolean> {
  constructor(private reportsViewModel: ReportsViewModel) {}

  resolve(): Observable<boolean> {
    return this.reportsViewModel.initialize().pipe(take(1));
  }
}
