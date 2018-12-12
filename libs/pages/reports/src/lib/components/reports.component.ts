import { Component, OnInit } from '@angular/core';
import { ReportsViewModel } from './reports.viewmodel';

@Component({
  selector: 'campus-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  constructor(public viewModel: ReportsViewModel) {}

  ngOnInit() {}
}
