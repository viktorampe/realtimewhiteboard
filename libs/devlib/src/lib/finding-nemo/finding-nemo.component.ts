import { Component, OnInit, Type } from '@angular/core';
import {
  EduContentMetadataFixture,
  EduContentMetadataInterface
} from '@campus/dal';
import {
  SearchFilterCriteriaInterface,
  SearchModeInterface,
  SearchResultInterface,
  SearchResultItemInterface,
  SearchStateInterface
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
  searchMode: SearchModeInterface;
  searchState: SearchStateInterface;

  constructor() {}

  ngOnInit() {
    this.searchMode = {
      name: 'demo',
      label: 'demo',
      dynamicFilters: false,
      searchFilterFactory: [],
      results: {
        sortModes: [
          {
            description: 'book',
            name: 'book',
            icon: 'book'
          },
          {
            description: 'bundle',
            name: 'bundle',
            icon: 'bundle'
          },
          {
            description: 'taak',
            name: 'taak',
            icon: 'taak'
          }
        ],
        pageSize: 5
      }
    };
    this.searchState = {
      searchTerm: '',
      filterCriteriaSelections: new Map()
      // from: 0,
      // sort: null,
    };

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
        new EduContentMetadataFixture({ title: 'foo' }),
        new EduContentMetadataFixture({ title: 'bar' }),
        new EduContentMetadataFixture({ title: 'foobar' })
      ],
      filterCriteriaPredictions: new Map()
    };
  }

  resetResults() {
    this.searchState = {
      searchTerm: '',
      filterCriteriaSelections: new Map(),
      from: 0,
      sort: 'bundle'
    };
  }
}
