import { Component, Inject, Type } from '@angular/core';
import { EduContentMetadataFixture, LearningAreaFixture } from '@campus/dal';
import {
  SearchFilterCriteriaInterface,
  SearchFilterFactory,
  SearchFilterInterface,
  SearchModeInterface,
  SearchResultInterface,
  SearchResultItemComponentInterface,
  SearchStateInterface,
  SortModeInterface
} from '@campus/search';
import { EduContentMetadataApi } from '@diekeure/polpo-api-angular-sdk';
// tslint:disable-next-line:nx-enforce-module-boundaries
import { STANDARD_SEARCH_SERVICE_TOKEN } from 'apps/polpo-classroom-web/src/app/services/standard-search.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PolpoResultItemComponent } from '../polpo-result-item/polpo-result-item.component';
// tslint:disable-next-line:nx-enforce-module-boundaries
import { MockSearchViewModel } from './../../../../search/src/lib/components/search.viewmodel.mock';

@Component({
  selector: 'campus-finding-nemo',
  templateUrl: './finding-nemo.component.html',
  styleUrls: ['./finding-nemo.component.scss']
})
export class FindingNemoComponent {
  public resultItemComponent: Type<SearchResultItemComponentInterface>;
  public resultsPage$ = new BehaviorSubject<SearchResultInterface>(null);
  public searchMode: SearchModeInterface;
  public searchState = new BehaviorSubject<SearchStateInterface>(null);
  // public autoComplete = true;
  public filterCriteria$ = new BehaviorSubject<SearchFilterCriteriaInterface[]>(
    null
  );

  private loadTimer: number;
  public searchFilters$: Observable<SearchFilterInterface[]>;

  constructor(
    private eduContentMetadataApi: EduContentMetadataApi,
    @Inject(STANDARD_SEARCH_SERVICE_TOKEN)
    private standardSearchFactory: SearchFilterFactory
  ) {
    this.setMockData();
    this.searchFilters$ = this.standardSearchFactory.getFilters(
      {} as SearchStateInterface
    );
  }

  setMockData() {
    this.searchMode = this.getMockSearchMode();
    this.searchState.next(this.getMockSearchState());
    this.resultsPage$.next(this.getMockResults());
    this.filterCriteria$.next(this.getMockSearchFilters());
  }

  catchEvent($event: SearchFilterCriteriaInterface[]) {
    console.log($event);
    this.filterCriteria$.next([...this.getMockSearchFilters(), ...$event]);
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
    if (this.loadTimer) {
      // in case we resetted the list, we should cancel the running request
      window.clearTimeout(this.loadTimer);
      this.loadTimer = null;
    }
    this.loadTimer = window.setTimeout(() => {
      this.resultsPage$.next({ ...resultsPage });
      this.loadTimer = null;
    }, 2500);
    return;

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
      .subscribe((results: SearchResultInterface) => {
        this.resultsPage$.next(results);
      });
  }

  onGetNextPage(from) {
    console.log('getNextPage from', from);
    this.loadMoreResults(from);
  }

  onSortBy(sort: SortModeInterface) {
    this.searchState.next({
      ...this.searchState.value,
      sort: sort.name
    });
    this.loadMoreResults();
  }

  onChange(value: string) {
    console.log(value);
  }

  onFilterSelectionChange(value: string) {
    console.log(value);
  }

  private getMockSearchMode(): SearchModeInterface {
    return {
      name: 'demo',
      label: 'demo',
      dynamicFilters: false,
      // tslint:disable-next-line: no-use-before-declare
      searchFilterFactory: MockFactory,
      results: {
        component: PolpoResultItemComponent,
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
  }

  private getMockSearchState(): SearchStateInterface {
    return {
      searchTerm: '',
      filterCriteriaSelections: new Map(),
      from: 0
    };
  }

  private getMockResults(): SearchResultInterface {
    return {
      count: 2,
      results: [
        new LearningAreaFixture({ id: 1 }),
        new LearningAreaFixture({ id: 2 })
      ],
      filterCriteriaPredictions: new Map([
        ['LearningArea', new Map([[1, 100], [2, 50]])]
      ])
    };
  }

  private getMockSearchFilters(): SearchFilterCriteriaInterface[] {
    return [
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
  }
}

class MockFactory implements SearchFilterFactory {
  constructor(private mockSearchViewModel: MockSearchViewModel) {}

  getFilters(
    searchState: SearchStateInterface
  ): Observable<SearchFilterInterface[]> {
    return this.mockSearchViewModel.searchFilters$;
  }
}
