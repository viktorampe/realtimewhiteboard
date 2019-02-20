import { Component, OnInit, Type } from '@angular/core';
import {
  CredentialFixture,
  EduContentMetadataFixture,
  EduContentMetadataInterface,
  LearningAreaFixture
} from '@campus/dal';
import {
  SearchFilterCriteriaInterface,
  SearchResultInterface,
  SearchResultItemInterface
} from '@campus/search';
import { PolpoResultItemComponent } from '../polpo-result-item/polpo-result-item.component';

@Component({
  selector: 'campus-finding-nemo',
  templateUrl: './finding-nemo.component.html',
  styleUrls: ['./finding-nemo.component.scss']
})
export class FindingNemoComponent implements OnInit {
  selectFilter: SearchFilterCriteriaInterface;
  resultItemComponent: Type<SearchResultItemInterface>;
  resultsPage: SearchResultInterface<EduContentMetadataInterface>;

  constructor() {}

  ngOnInit() {
    this.resultItemComponent = PolpoResultItemComponent;
    this.resetResults();
    // this.loadMoreResults();
  }

  onFilterSelectionChange(searchFilter: SearchFilterCriteriaInterface) {
    console.log(searchFilter);
  }

  loadMoreResults() {
    this.resultsPage = {
      count: 3,
      results: [
        new EduContentMetadataFixture(),
        new EduContentMetadataFixture(),
        new EduContentMetadataFixture()
      ],
      filterCriteriaPredictions: new Map()
    };
  }

  resetResults() {
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
  }
}
