import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'campus-methods-overview',
  templateUrl: './methods-overview.component.html',
  styleUrls: ['./methods-overview.component.scss']
})
export class MethodsOverviewComponent implements OnInit {
  public data = {
    logoUrl: 'beautemps.svg',
    name: 'testnaam',
    years: [
      {
        id: 1,
        name: 'L1',
        bookId: 2
      },
      {
        id: 2,
        name: 'L2',
        bookId: 3
      }
    ]
  };
  constructor() {}

  ngOnInit() {}
}
