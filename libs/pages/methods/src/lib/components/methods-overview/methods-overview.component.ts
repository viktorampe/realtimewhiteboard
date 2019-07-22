import { Component, OnInit } from '@angular/core';
import { of } from 'rxjs';

@Component({
  selector: 'campus-methods-overview',
  templateUrl: './methods-overview.component.html',
  styleUrls: ['./methods-overview.component.scss']
})
export class MethodsOverviewComponent implements OnInit {
  public books$ = of([
    {
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
        },
        {
          id: 3,
          name: 'L3',
          bookId: 4
        },
        {
          id: 4,
          name: 'L4',
          bookId: 5
        }
      ]
    }
  ]);
  constructor() {}

  ngOnInit() {}
}
