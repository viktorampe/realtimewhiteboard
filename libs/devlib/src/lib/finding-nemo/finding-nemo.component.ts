import { Component, OnInit } from '@angular/core';
import { CredentialFixture, LearningAreaFixture } from '@campus/dal';
import {
  SearchFilterCriteriaFixture,
  SearchFilterCriteriaInterface,
  SearchFilterCriteriaValuesFixture
} from '@campus/search';

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
  selectFilter: SearchFilterCriteriaInterface;

  breadCrumbFilterCriteria: SearchFilterCriteriaInterface[];

  constructor() {}

  ngOnInit() {
    const searchFilter = new SearchFilterCriteriaFixture(
      {
        name: 'selectFilter',
        label: 'select filter'
      },
      [
        new SearchFilterCriteriaValuesFixture({
          data: new LearningAreaFixture({
            id: 1,
            name: 'foo'
          })
        }),
        new SearchFilterCriteriaValuesFixture({
          data: new LearningAreaFixture({
            id: 2,
            name: 'bar'
          })
        })
      ]
    );

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
