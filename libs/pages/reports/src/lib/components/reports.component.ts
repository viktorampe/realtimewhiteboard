import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'campus-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  learningArea$: Observable<string> = of('lol');
  filterTextInput = {
    result$: of('lol')
  };
  listFormat$: Observable<string> = of('lol');

  constructor() {}

  ngOnInit() {}
}
