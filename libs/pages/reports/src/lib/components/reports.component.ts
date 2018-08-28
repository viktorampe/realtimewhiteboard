import { Component } from '@angular/core';
import { ReportsViewModel } from './reports.viewmodel';

@Component({
  selector: 'campus-reports-component',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent {
  constructor(private reportsViewModel: ReportsViewModel) {}

  //TODO add code
}
