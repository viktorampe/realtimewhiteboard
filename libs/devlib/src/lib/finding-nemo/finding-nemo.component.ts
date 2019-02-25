import { ChangeDetectorRef, Component, OnInit, Type } from '@angular/core';
import {
  CredentialFixture,
  EduContentMetadataFixture,
  EduContentMetadataInterface,
  LearningAreaFixture
} from '@campus/dal';
import {
  SearchFilterCriteriaFixture,
  SearchFilterCriteriaInterface,
  SearchFilterCriteriaValuesFixture,
  SearchModeInterface,
  SearchResultInterface,
  SearchResultItemInterface,
  SearchStateInterface
} from '@campus/search';
import { EduContentMetadataApi } from '@diekeure/polpo-api-angular-sdk';
import { BehaviorSubject, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { PolpoResultItemComponent } from '../polpo-result-item/polpo-result-item.component';

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
  public selectFilter: SearchFilterCriteriaInterface;
  public selectedFilterCriteria: SearchFilterCriteriaInterface;
  public resultItemComponent: Type<SearchResultItemInterface>;
  public resultsPage$: Subject<
    SearchResultInterface<EduContentMetadataInterface>
  > = new Subject();
  public searchMode: SearchModeInterface;
  public searchState: BehaviorSubject<
    SearchStateInterface
  > = new BehaviorSubject(null);
  public breadCrumbFilterCriteria: SearchFilterCriteriaInterface[];

  private loadTimer: number;

  constructor(
    private cd: ChangeDetectorRef,
    private eduContentMetadataApi: EduContentMetadataApi
  ) {}

  ngOnInit() {
    this.selectFilter = new SearchFilterCriteriaFixture(
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
          }),
          selected: true
        })
      ]
    );

    this.selectFilter = new SearchFilterCriteriaFixture(
      { label: 'search filter' },
      [
        new SearchFilterCriteriaValuesFixture(
          {
            data: new LearningAreaFixture({
              id: 1,
              name: 'Aardrijkskunde'
            })
          },
          new SearchFilterCriteriaFixture(
            { keyProperty: 'id', displayProperty: 'provider' },
            [
              new SearchFilterCriteriaValuesFixture({
                data: new CredentialFixture({ id: 1, provider: 'smartschool' })
              }),
              new SearchFilterCriteriaValuesFixture({
                data: new CredentialFixture({ id: 2, provider: 'google' })
              }),
              new SearchFilterCriteriaValuesFixture({
                data: new CredentialFixture({ id: 3, provider: 'facebook' })
              })
            ]
          )
        ),
        new SearchFilterCriteriaValuesFixture(
          {
            data: new LearningAreaFixture({
              id: 2,
              name: 'Geschiedenis'
            })
          },
          new SearchFilterCriteriaFixture(
            { keyProperty: 'id', displayProperty: 'provider' },
            [
              new SearchFilterCriteriaValuesFixture({
                data: new CredentialFixture({ id: 1, provider: 'smartschool' })
              }),
              new SearchFilterCriteriaValuesFixture({
                data: new CredentialFixture({ id: 2, provider: 'google' })
              }),
              new SearchFilterCriteriaValuesFixture({
                data: new CredentialFixture({ id: 3, provider: 'facebook' })
              })
            ]
          )
        ),
        new SearchFilterCriteriaValuesFixture(
          {
            data: new LearningAreaFixture({
              id: 3,
              name: 'Wiskunde'
            })
          },
          new SearchFilterCriteriaFixture(
            { keyProperty: 'id', displayProperty: 'provider' },
            [
              new SearchFilterCriteriaValuesFixture({
                data: new CredentialFixture({ id: 1, provider: 'smartschool' })
              }),
              new SearchFilterCriteriaValuesFixture({
                data: new CredentialFixture({ id: 2, provider: 'google' })
              }),
              new SearchFilterCriteriaValuesFixture({
                data: new CredentialFixture({ id: 3, provider: 'facebook' })
              })
            ]
          )
        ),
        new SearchFilterCriteriaValuesFixture({
          data: new LearningAreaFixture({
            id: 4,
            name: 'Informatica'
          }),
          visible: false
        }),
        new SearchFilterCriteriaValuesFixture({
          data: new LearningAreaFixture({
            id: 5,
            name: 'Engels'
          }),
          prediction: 0
        })
      ]
    );

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

    this.breadCrumbFilterCriteria = mockBreadcrumbFilterCriteria;

    this.searchState.next({
      searchTerm: '',
      filterCriteriaSelections: new Map(),
      from: 0
      // sort: null,
    });

    this.resultItemComponent = PolpoResultItemComponent;
    // this.resetResults();
    // this.loadMoreResults();
  }

  onFilterSelectionChange(searchFilter: SearchFilterCriteriaInterface[]) {
    this.breadCrumbFilterCriteria = searchFilter;
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
    if (this.loadTimer) {
      // in case we resetted the list, we should cancel the running request
      window.clearTimeout(this.loadTimer);
      this.loadTimer = null;
    }
    this.loadTimer = window.setTimeout(() => {
      this.resultsPage$.next({ ...resultsPage });
      this.loadTimer = null;
    }, 500);
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
    this.loadMoreResults(from);
  }

  onChange(value: string) {
    console.log(value);
  }
}
