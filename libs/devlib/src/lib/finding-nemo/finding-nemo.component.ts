import { Component, OnInit, Type } from '@angular/core';
import {
  CredentialFixture,
  EduContentMetadataFixture,
  EduContentMetadataInterface
} from '@campus/dal';
import {
  SearchFilterCriteriaFixture,
  SearchFilterCriteriaInterface,
  SearchFilterCriteriaValuesFixture,
  SearchModeInterface,
  SearchResultInterface,
  SearchResultItemComponentInterface,
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

const mockListCriteria = new SearchFilterCriteriaFixture(
  { keyProperty: 'id', displayProperty: 'provider' },
  [
    new SearchFilterCriteriaValuesFixture(
      {
        data: new CredentialFixture({
          id: 1,
          provider: 'smartschool'
        })
      },
      new SearchFilterCriteriaFixture(
        { keyProperty: 'id', displayProperty: 'provider' },
        [
          new SearchFilterCriteriaValuesFixture(
            {
              data: new CredentialFixture({
                id: 1,
                provider: 'x'
              })
            },

            new SearchFilterCriteriaFixture(
              { keyProperty: 'id', displayProperty: 'provider' },
              [
                new SearchFilterCriteriaValuesFixture({
                  data: new CredentialFixture({
                    id: 1,
                    provider: 'xx'
                  })
                }),
                new SearchFilterCriteriaValuesFixture({
                  data: new CredentialFixture({
                    id: 2,
                    provider: 'xx'
                  })
                }),
                new SearchFilterCriteriaValuesFixture({
                  data: new CredentialFixture({
                    id: 3,
                    provider: 'xx'
                  })
                })
              ]
            )
          ),
          new SearchFilterCriteriaValuesFixture({
            data: new CredentialFixture({
              id: 2,
              provider: 'x'
            })
          }),
          new SearchFilterCriteriaValuesFixture(
            {
              data: new CredentialFixture({
                id: 3,
                provider: 'x'
              })
            },
            new SearchFilterCriteriaFixture(
              { keyProperty: 'id', displayProperty: 'provider' },
              [
                new SearchFilterCriteriaValuesFixture({
                  data: new CredentialFixture({
                    id: 1,
                    provider: 'xy'
                  })
                }),
                new SearchFilterCriteriaValuesFixture({
                  data: new CredentialFixture({
                    id: 2,
                    provider: 'xy'
                  })
                }),
                new SearchFilterCriteriaValuesFixture(
                  {
                    data: new CredentialFixture({
                      id: 3,
                      provider: 'xy'
                    })
                  },
                  new SearchFilterCriteriaFixture(
                    {
                      keyProperty: 'id',
                      displayProperty: 'provider'
                    },
                    [
                      new SearchFilterCriteriaValuesFixture({
                        data: new CredentialFixture({
                          id: 1,
                          provider: 'xyz'
                        })
                      }),
                      new SearchFilterCriteriaValuesFixture({
                        data: new CredentialFixture({
                          id: 2,
                          provider: 'xyz'
                        })
                      }),
                      new SearchFilterCriteriaValuesFixture({
                        data: new CredentialFixture({
                          id: 3,
                          provider: 'xyz'
                        })
                      })
                    ]
                  )
                )
              ]
            )
          )
        ]
      )
    ),
    new SearchFilterCriteriaValuesFixture({
      data: new CredentialFixture({ id: 2, provider: 'google' })
    })
  ]
);

@Component({
  selector: 'campus-finding-nemo',
  templateUrl: './finding-nemo.component.html',
  styleUrls: ['./finding-nemo.component.scss']
})
export class FindingNemoComponent implements OnInit {
  public selectFilter: SearchFilterCriteriaInterface;
  public selectedFilterCriteria: SearchFilterCriteriaInterface;
  public resultItemComponent: Type<SearchResultItemComponentInterface>;
  public resultsPage$: Subject<
    SearchResultInterface<EduContentMetadataInterface>
  > = new Subject();
  public searchMode: SearchModeInterface;
  public searchState: BehaviorSubject<
    SearchStateInterface
  > = new BehaviorSubject(null);
  public breadCrumbFilterCriteria: SearchFilterCriteriaInterface[];
  public autoComplete = true;
  public filterCriteria$ = new BehaviorSubject<SearchFilterCriteriaInterface[]>(
    null
  );

  private loadTimer: number;
  private mockData: SearchFilterCriteriaInterface[] = [
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

  constructor(private eduContentMetadataApi: EduContentMetadataApi) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.setMockData();
  }

  setMockData() {
    this.searchMode = {
      name: 'demo',
      label: 'demo',
      dynamicFilters: false,
      searchFilterFactory: [],
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

    this.breadCrumbFilterCriteria = mockBreadcrumbFilterCriteria;

    this.searchState.next({
      searchTerm: '',
      filterCriteriaSelections: new Map(),
      from: 0
      // sort: null,
    });

    this.filterCriteria$.next(this.mockData);

    this.selectFilter = mockListCriteria;
  }

  catchEvent($event: SearchFilterCriteriaInterface[]) {
    console.log($event);
    this.filterCriteria$.next([...this.mockData, ...$event]);
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
      .subscribe(
        (results: SearchResultInterface<EduContentMetadataInterface>) => {
          this.resultsPage$.next(results);
        }
      );
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

  onFilterSelectionChange(value: string) {
    console.log(value);
  }
}
