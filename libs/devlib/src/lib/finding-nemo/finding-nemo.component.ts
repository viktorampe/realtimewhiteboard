import { Component } from '@angular/core';
import { SearchFilterCriteriaInterface } from '@campus/search';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'campus-finding-nemo',
  templateUrl: './finding-nemo.component.html',
  styleUrls: ['./finding-nemo.component.scss']
})
export class FindingNemoComponent {
  filterCriteria$ = new BehaviorSubject<SearchFilterCriteriaInterface[]>(null);

  constructor() {}

  setMockData() {
    this.filterCriteria$.next([
      {
        name: 'criteria name',
        label: 'The label of the criteria',
        keyProperty: 'id',
        displayProperty: 'name',
        values: [
          {
            data: {
              id: 1,
              name: 'foo jaar'
            },
            selected: true
          },
          {
            data: {
              id: 2,
              name: 'bar jaar'
            },
            selected: false
          },
          {
            data: {
              id: 3,
              name: 'baz jaar'
            },
            selected: false
          }
        ]
      }
    ]);
  }

  catchEvent($event: SearchFilterCriteriaInterface[]) {
    console.log($event);
    this.filterCriteria$.next($event);
  }
}
