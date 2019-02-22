import { ChangeDetectorRef, Component, OnInit, Type } from '@angular/core';
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
import { EduContentMetadataApi } from '@diekeure/polpo-api-angular-sdk';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { PolpoResultItemComponent } from '../polpo-result-item/polpo-result-item.component';

@Component({
  selector: 'campus-finding-nemo',
  templateUrl: './finding-nemo.component.html',
  styleUrls: ['./finding-nemo.component.scss']
})
export class FindingNemoComponent implements OnInit {
  selectFilter: SearchFilterCriteriaInterface;
  resultItemComponent: Type<SearchResultItemInterface>;
  resultsPage$: Subject<
    SearchResultInterface<EduContentMetadataInterface>
  > = new Subject();
  searchMode: SearchModeInterface;
  searchState: Subject<SearchStateInterface> = new Subject();

  constructor(
    private cd: ChangeDetectorRef,
    private eduContentMetadataApi: EduContentMetadataApi
  ) {}

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
        pageSize: 3
      }
    };
    this.searchState.next({
      searchTerm: '',
      filterCriteriaSelections: new Map()
      // from: 0,
      // sort: null,
    });

    this.resultItemComponent = PolpoResultItemComponent;
    this.resetResults();
    this.loadMoreResults();
  }

  onFilterSelectionChange(searchFilter: SearchFilterCriteriaInterface) {
    console.log(searchFilter);
  }

  loadMoreResults(from = 0) {
    console.log('loadMoreResults');
    const resultsPage = {
      count: 30,
      results: [
        new EduContentMetadataFixture({ title: 'foo' }),
        new EduContentMetadataFixture({ title: 'bar' }),
        new EduContentMetadataFixture({ title: 'foobar' })
      ],
      filterCriteriaPredictions: new Map()
    };
    this.eduContentMetadataApi
      .search(
        '',
        {
          eduContentProductType: [],
          eduNets: [],
          grades: [],
          learningArea: [],
          learningDomains: [],
          methods: [],
          schoolTypes: [],
          years: []
        } as any,
        from,
        null
      )
      .pipe(
        map((results: any) => {
          return {
            count: results.count,
            results: results.metadata,
            filterCriteriaPredictions: results.filters
          };
        })
      )
      .subscribe(
        (results: SearchResultInterface<EduContentMetadataInterface>) => {
          this.resultsPage$.next(results);
        }
      );
    // this.cd.detectChanges();
  }

  resetResults() {
    this.searchState.next({
      searchTerm: '',
      filterCriteriaSelections: new Map(),
      from: 0,
      sort: 'bundle'
    });
  }

  onGetNextPage(from) {
    console.log('getNextPage from', from);

    // simulate xhr call that takes 0.8sec
    this.loadMoreResults(from);
  }
}
