import { Component, OnInit } from '@angular/core';
import { CredentialFixture, LearningAreaFixture } from '@campus/dal';
import { SearchFilterCriteriaInterface } from '@campus/search';

const mockBreadcrumbFilterCriteria: SearchFilterCriteriaInterface[] = [
  {
    name: 'breadCrumbFilter',
    label: 'Jaren',
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
  },
  {
    name: 'breadCrumbFilter',
    label: 'foo jaar',
    keyProperty: 'id',
    displayProperty: 'name',
    values: [
      {
        data: new LearningAreaFixture({
          id: 1,
          name: 'foo'
        }),
        selected: true
      },
      {
        data: new LearningAreaFixture({
          id: 2,
          name: 'bar'
        }),
        selected: false
      }
    ]
  },
  {
    name: 'breadCrumbFilter',
    label: 'foo learning area',
    keyProperty: 'id',
    displayProperty: 'name',
    values: [
      {
        data: {
          id: 1,
          name: 'foo'
        },
        selected: false
      },
      {
        data: {
          id: 2,
          name: 'bar'
        },
        selected: true
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
  selectFilter: SearchFilterCriteriaInterface;

  breadCrumbFilterCriteria: SearchFilterCriteriaInterface[];

  constructor() {}

  ngOnInit() {
    this.selectFilter = {
      name: 'selectFilter',
      label: 'select filter',
      keyProperty: 'id',
      displayProperty: 'name',
      values: [
        {
          data: new LearningAreaFixture({
            id: 1,
            name: 'foo'
          }),
          selected: false,
          prediction: 0,
          visible: true,
          child: {
            name: 'selectFilter',
            label: 'select filter',
            keyProperty: 'id',
            displayProperty: 'provider',
            values: [
              {
                data: new CredentialFixture(),
                selected: false,
                prediction: 0,
                visible: true
              }
            ]
          }
        },
        {
          data: new LearningAreaFixture({
            id: 2,
            name: 'bar'
          }),
          selected: false,
          prediction: 0,
          visible: true,
          child: null
        }
      ]
    };

    this.breadCrumbFilterCriteria = mockBreadcrumbFilterCriteria;
  }

  onFilterSelectionChange(searchFilter: SearchFilterCriteriaInterface[]) {
    this.breadCrumbFilterCriteria = searchFilter;
    console.log(searchFilter);
  }
}
