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

  mockData: SearchFilterCriteriaInterface[] = [
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
          selected: false
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
          selected: false,
          prediction: 3
        }
      ]
    }
  ];

  setMockData() {
    this.filterCriteria$.next(this.mockData);
  }

  catchEvent($event: SearchFilterCriteriaInterface[]) {
    console.log($event);
    this.filterCriteria$.next([...this.mockData, ...$event]);
  }
}
