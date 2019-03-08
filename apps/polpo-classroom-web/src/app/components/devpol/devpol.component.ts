import { Component, OnInit, Type, ViewChild } from '@angular/core';
import { SearchFilterFactory, SearchResultInterface } from '@campus/search';
import { ResultsListComponent } from 'libs/search/src/lib/components/results-list/results-list.component';
import { EduContentSearchResultComponent } from '../searchresults/edu-content-search-result.component';
import { EduContentSearchResultInterface } from '../searchresults/interfaces/educontent-search-result';

@Component({
  selector: 'campus-devpol',
  templateUrl: './devpol.component.html',
  styleUrls: ['./devpol.component.scss']
})
export class DevpolComponent implements OnInit {
  @ViewChild(ResultsListComponent)
  private resultsList: ResultsListComponent;

  constructor() {}

  ngOnInit() {
    this.resultsList.searchMode = {
      name: 'foo',
      label: 'foo',
      dynamicFilters: false,
      searchFilterFactory: {} as Type<SearchFilterFactory>,
      results: {
        component: EduContentSearchResultComponent,
        sortModes: [],
        pageSize: 5
      }
    };
    this.resultsList.searchState = {
      searchTerm: '',
      filterCriteriaSelections: new Map()
      // from: 0,
      // sort: null
    };
    this.resultsList.resultsPage = {
      count: 1,
      results: [
        {
          inTask: true
        } as EduContentSearchResultInterface
      ],
      filterCriteriaPredictions: null
    } as SearchResultInterface;
  }
}
