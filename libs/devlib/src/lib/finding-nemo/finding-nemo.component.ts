import { Component, OnInit } from '@angular/core';
import {
  CredentialFixture,
  LearningAreaFixture,
  LearningAreaInterface,
  PassportUserCredentialInterface
} from '@campus/dal';
import { SearchFilterCriteriaInterface } from '@campus/search';

type FilterCriteria = SearchFilterCriteriaInterface<
  LearningAreaInterface,
  SearchFilterCriteriaInterface<PassportUserCredentialInterface, null>
>;

@Component({
  selector: 'campus-finding-nemo',
  templateUrl: './finding-nemo.component.html',
  styleUrls: ['./finding-nemo.component.scss']
})
export class FindingNemoComponent implements OnInit {
  selectFilter: FilterCriteria;

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
          children: {
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
          children: null
        }
      ]
    };
  }

  onFilterSelectionChange(selection: FilterCriteria) {
    console.log(selection);
  }
}
