// tslint:disable:nx-enforce-module-boundaries
import {
  AfterViewInit,
  Component,
  Injectable,
  QueryList,
  Type,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {
  DalState,
  EduContentFixture,
  EduContentMetadataFixture,
  EduContentProductTypeActions,
  EduContentProductTypeFixture,
  EduNetActions,
  LearningDomainActions,
  MethodActions,
  SchoolTypeActions,
  YearActions
} from '@campus/dal';
import {
  MockSearchViewModel,
  SearchComponent,
  SearchFilterCriteriaInterface,
  SearchFilterFactory,
  SearchFilterInterface,
  SearchModeInterface,
  SearchPortalDirective,
  SearchResultInterface,
  SearchResultItemComponentInterface,
  SearchStateInterface,
  SortModeInterface
} from '@campus/search';
import { TileSecondaryActionInterface } from '@campus/ui';
import { EduContentMetadataApi } from '@diekeure/polpo-api-angular-sdk';
import { Store } from '@ngrx/store';
import { EduContentSearchResultComponent } from 'apps/polpo-classroom-web/src/app/components/searchresults/edu-content-search-result.component';
import { SearchTermFilterFactory } from 'apps/polpo-classroom-web/src/app/factories/search-term-filter/search-term-filter.factory';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'campus-finding-nemo',
  templateUrl: './finding-nemo.component.html',
  styleUrls: ['./finding-nemo.component.scss']
})
export class FindingNemoComponent implements AfterViewInit {
  public resultItemComponent: Type<SearchResultItemComponentInterface>;
  public resultsPage$ = new BehaviorSubject<SearchResultInterface>(null);
  public searchMode: SearchModeInterface;
  public searchState = new BehaviorSubject<SearchStateInterface>(null);
  public autoComplete: string[];
  public filterCriteria$ = new BehaviorSubject<SearchFilterCriteriaInterface[]>(
    null
  );
  public secondaryActions: TileSecondaryActionInterface[];

  private loadTimer: number;
  public searchFilters$: Observable<SearchFilterInterface[]>;

  @ViewChildren(SearchPortalDirective)
  private portalHosts: QueryList<SearchPortalDirective>;

  @ViewChild(SearchComponent) private searchComponent: SearchComponent;

  constructor(
    private eduContentMetadataApi: EduContentMetadataApi,
    private store: Store<DalState>
  ) {
    this.store.dispatch(
      new EduContentProductTypeActions.LoadEduContentProductTypes()
    );

    this.store.dispatch(new YearActions.LoadYears());
    this.store.dispatch(new EduNetActions.LoadEduNets());
    this.store.dispatch(new SchoolTypeActions.LoadSchoolTypes());
    this.store.dispatch(new MethodActions.LoadMethods());
    this.store.dispatch(new LearningDomainActions.LoadLearningDomains());

    this.setMockData();
  }

  ngAfterViewInit(): void {
    this.searchComponent.searchPortals = this.portalHosts;
    setTimeout(() => {
      this.searchComponent.reset(this.searchState.value);
    }, 3000);
  }

  tileClick() {
    console.log('tile click!');
  }

  setMockData() {
    this.secondaryActions = [
      {
        label: 'Bekijken',
        icon: 'magnifier',
        onClick: event => {
          console.log('secondaryAction');
        }
      }
    ];
    this.searchMode = this.getMockSearchMode();
    this.searchState.next(this.getMockSearchState());
    this.resultsPage$.next(this.getMockResults());
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
      searchFilterFactory: SearchTermFilterFactory,
      searchTerm: {
        // autocompleteEl: string; //reference to material autocomplete component
        domHost: 'hostLeft'
      },
      results: {
        component: EduContentSearchResultComponent,
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
      filterCriteriaSelections: new Map([['learningArea', [2]]]),
      from: 0
    };
  }

  private getMockResults(): SearchResultInterface {
    return {
      count: 2,
      results: [
        {
          eduContent: new EduContentFixture(
            {},
            {
              title: 'Aanliggende hoeken',
              description:
                'In dit leerobject maken leerlingen 3 tikoefeningen op aanliggende hoeken.',
              fileExt: 'ludo.zip'
            }
          ),
          inTask: true
        },
        {
          eduContent: new EduContentFixture(
            {},
            {
              thumbSmall:
                'https://avatars3.githubusercontent.com/u/31932368?s=460&v=4'
            }
          ),
          inBundle: true
        },
        {
          eduContent: new EduContentFixture(
            {},
            {
              eduContentProductType: new EduContentProductTypeFixture({
                pedagogic: true
              })
            }
          ),
          isFavorite: true
        }
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

@Injectable({ providedIn: 'root' })
class MockFactory implements SearchFilterFactory {
  mockSearchViewmodel = new MockSearchViewModel();

  getFilters(
    searchState: SearchStateInterface
  ): Observable<SearchFilterInterface[]> {
    return this.mockSearchViewmodel.searchFilters$;
  }
}
