import { Component, Type } from '@angular/core';
import { EduContentMetadataFixture, LearningAreaFixture } from '@campus/dal';
import {
  SearchFilterCriteriaFixture,
  SearchFilterCriteriaInterface,
  SearchFilterCriteriaValuesFixture,
  SearchFilterFactory,
  SearchFilterInterface,
  SearchModeInterface,
  SearchResultInterface,
  SearchResultItemComponentInterface,
  SearchStateInterface
} from '@campus/search';
import { EduContentMetadataApi } from '@diekeure/polpo-api-angular-sdk';
import { BreadcrumbFilterComponent } from 'libs/search/src/lib/components/breadcrumb-filter/breadcrumb-filter.component';
import { CheckboxLineFilterComponent } from 'libs/search/src/lib/components/checkbox-line-filter/checkbox-line-filter-component';
import { CheckboxListFilterComponent } from 'libs/search/src/lib/components/checkbox-list-filter/checkbox-list-filter.component';
import { ColumnFilterComponent } from 'libs/search/src/lib/components/column-filter/column-filter.component';
import { SelectFilterComponent } from 'libs/search/src/lib/components/select-filter-component/select-filter.component';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { PolpoResultItemComponent } from '../polpo-result-item/polpo-result-item.component';

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
  public autoComplete: string[];
  public filterCriteria$ = new BehaviorSubject<SearchFilterCriteriaInterface[]>(
    null
  );

  private loadTimer: number;

  constructor(private eduContentMetadataApi: EduContentMetadataApi) {
    this.setMockData();
  }

  setMockData() {
    this.searchMode = this.getMockSearchMode();
    this.searchState.next(this.getMockSearchState());
    this.resultsPage$.next(this.getMockResults());
    this.filterCriteria$.next(this.getMockSearchFilters());
    this.autoComplete = this.getMockAutoCompleteValues();
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
      searchTerm: {
        // autocompleteEl: string; //reference to material autocomplete component
        domHost: '#searchTermContainer'
      },
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
      searchTerm: 'nemo',
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

  private getMockAutoCompleteValues(): string[] {
    return ['waarde1', 'waarde2', 'waarde3', 'waarde4'];
  }
}

class MockFactory implements SearchFilterFactory {
  getFilters(
    searchState: SearchStateInterface
  ): Observable<SearchFilterInterface[]> {
    return of(this.getMockSearchFilter());
  }

  private getMockSearchFilter(): SearchFilterInterface[] {
    const mockSearchFilter = [
      {
        criteria: new SearchFilterCriteriaFixture({}, [
          new SearchFilterCriteriaValuesFixture(),
          new SearchFilterCriteriaValuesFixture({
            data: { id: 2, name: 'foo' }
          }),
          new SearchFilterCriteriaValuesFixture({
            data: { id: 3, name: 'foo bar' }
          })
        ]),
        component: new CheckboxLineFilterComponent(),
        domHost: 'hostleft'
      },
      {
        criteria: new SearchFilterCriteriaFixture({}, [
          new SearchFilterCriteriaValuesFixture(),
          new SearchFilterCriteriaValuesFixture({
            data: { id: 2, name: 'foo' }
          }),
          new SearchFilterCriteriaValuesFixture({
            data: { id: 3, name: 'foo bar' }
          })
        ]),
        component: new CheckboxListFilterComponent(),
        domHost: 'hostleft'
      },
      {
        criteria: new SearchFilterCriteriaFixture({}, [
          new SearchFilterCriteriaValuesFixture(),
          new SearchFilterCriteriaValuesFixture({
            data: { id: 2, name: 'foo' }
          }),
          new SearchFilterCriteriaValuesFixture({
            data: { id: 3, name: 'foo bar' }
          })
        ]),
        component: new BreadcrumbFilterComponent(),
        domHost: 'hosttop'
      },
      {
        criteria: new SearchFilterCriteriaFixture({}, [
          new SearchFilterCriteriaValuesFixture(),
          new SearchFilterCriteriaValuesFixture({
            data: { id: 2, name: 'foo' }
          }),
          new SearchFilterCriteriaValuesFixture({
            data: { id: 3, name: 'foo bar' }
          })
        ]),
        component: new ColumnFilterComponent(),
        domHost: 'hostleft'
      },
      {
        criteria: new SearchFilterCriteriaFixture({}, [
          new SearchFilterCriteriaValuesFixture(),
          new SearchFilterCriteriaValuesFixture({
            data: { id: 2, name: 'foo' }
          }),
          new SearchFilterCriteriaValuesFixture({
            data: { id: 3, name: 'foo bar' }
          })
        ]),
        component: new SelectFilterComponent(),
        domHost: 'hosttop'
      }
    ];

    return mockSearchFilter;
  }
}
