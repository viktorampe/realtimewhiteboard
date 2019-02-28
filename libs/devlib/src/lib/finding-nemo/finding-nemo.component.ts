import { Component, OnInit } from '@angular/core';
import { SearchFilterCriteriaInterface } from '@campus/search';
import { BehaviorSubject } from 'rxjs';

const mockBreadcrumbFilterCriteria: SearchFilterCriteriaInterface[] = [
  {
    name: 'breadCrumbFilter',
    label: 'koepels',
    keyProperty: 'id',
    displayProperty: 'name',
    values: [
      {
        data: {
          id: 1,
          name: 'Gemeenschapsonderwijs'
        },
        selected: true
      },
      {
        data: {
          id: 2,
          name: 'Officieel gesubsidieerd onderwijs'
        },
        selected: false
      },
      {
        data: {
          id: 3,
          name: 'Vrij gesubsidieerd onderwijs'
        },
        selected: false
      }
    ]
  },
  {
    name: 'breadCrumbFilter',
    label: 'Stromen',
    keyProperty: 'id',
    displayProperty: 'name',
    values: [
      {
        data: {
          id: 1,
          name: 'A-stroom'
        },
        selected: true
      },
      {
        data: {
          id: 2,
          name: 'ASO'
        },
        selected: false
      },
      {
        data: {
          id: 3,
          name: 'B-Stroom'
        },
        selected: false
      },
      {
        data: {
          id: 4,
          name: 'BSO'
        },
        selected: false
      }
    ]
  },
  {
    name: 'breadCrumbFilter',
    label: 'jaren',
    keyProperty: 'id',
    displayProperty: 'name',
    values: [
      {
        data: {
          id: 1,
          name: '1e jaar'
        },
        selected: true
      },
      {
        data: {
          id: 2,
          name: '2de jaar'
        },
        selected: false
      }
    ]
  },
  {
    name: 'breadCrumbFilter',
    label: 'richtingen',
    keyProperty: 'id',
    displayProperty: 'name',
    values: [
      {
        data: {
          id: 1,
          name: 'Economie'
        },
        selected: false
      },
      {
        data: {
          id: 2,
          name: 'Grieks'
        },
        selected: true
      },
      {
        data: {
          id: 2,
          name: 'Grieks-Latijn'
        },
        selected: false
      }
    ]
  }
];

@Component({
  selector: 'campus-finding-nemo',
  templateUrl: './finding-nemo.component.html',
  styleUrls: ['./finding-nemo.component.scss']
})
export class FindingNemoComponent implements OnInit {
  filterCriteria$ = new BehaviorSubject<SearchFilterCriteriaInterface[]>(null);

  breadCrumbFilterCriteria: SearchFilterCriteriaInterface[];

  constructor() {}

  ngOnInit() {
    // this.setMockData();
  }

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
  onChange(value: string) {
    console.log(value);
  }
}
