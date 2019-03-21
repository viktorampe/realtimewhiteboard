import { Injectable } from '@angular/core';
import {
  BundleFixture,
  EduContentFixture,
  EduContentProductTypeFixture,
  LearningAreaFixture,
  LearningAreaInterface,
  TaskFixture
} from '@campus/dal';
import {
  SearchModeInterface,
  SearchResultInterface,
  SearchStateInterface
} from '@campus/search';
import { ViewModelInterface } from '@campus/testing';
import { EduContentSearchResultComponent } from 'apps/polpo-classroom-web/src/app/components/searchresults/edu-content-search-result.component';
import { EduContentSearchResultInterface } from 'apps/polpo-classroom-web/src/app/components/searchresults/interfaces/educontent-search-result';
// tslint:disable-next-line: nx-enforce-module-boundaries
import { StandardSearchService } from 'apps/polpo-classroom-web/src/app/services/standard-search.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { EduContentsViewModel } from './edu-contents.viewmodel';

@Injectable({
  providedIn: 'root'
})
export class EduContentsViewModelMock
  implements ViewModelInterface<EduContentsViewModel> {
  private learningAreas = [
    new LearningAreaFixture({ id: 1, name: 'fooLearningArea' }),
    new LearningAreaFixture({ id: 2, name: 'barLearningArea' }),
    new LearningAreaFixture({ id: 3, name: 'bazLearningArea' })
  ];

  private favoriteLearningAreas = [
    new LearningAreaFixture({ id: 2, name: 'barLearningArea' }),
    new LearningAreaFixture({ id: 3, name: 'bazLearningArea' })
  ];

  private searchResults: EduContentSearchResultInterface = {
    eduContent: new EduContentFixture(),
    inTask: false,
    currentTask: new TaskFixture(),
    inBundle: false,
    currentBundle: new BundleFixture(),
    isFavorite: true
  };

  private searchState: SearchStateInterface = {
    searchTerm: 'foo',
    filterCriteriaSelections: new Map<string, (number | string)[]>([
      ['learningArea', [1]]
    ]),
    from: 0
  };

  private searchResult: SearchResultInterface = {
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
      ['LearningArea', new Map([[1, 2], [82, 50]])]
    ])
  };

  private searchMode: SearchModeInterface = {
    name: 'demo',
    label: 'demo',
    dynamicFilters: false,
    searchFilterFactory: StandardSearchService,
    searchTerm: {
      // autocompleteEl: string; //reference to material autocomplete component
      domHost: 'hostSearchTerm'
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

  public learningAreas$ = new BehaviorSubject<LearningAreaInterface[]>(
    this.learningAreas
  );
  public favoriteLearningAreas$ = new BehaviorSubject<LearningAreaInterface[]>(
    this.favoriteLearningAreas
  );
  public searchResults$ = new BehaviorSubject<EduContentSearchResultInterface>(
    this.searchResults
  );

  /*
   * let the page component pass through the updated state from the search component
   */
  public updateState(state: SearchStateInterface) {}

  /*
   * make auto-complete request to api service and return observable
   */
  public requestAutoComplete(string): Observable<string[]> {
    return of(['foo', 'bar', 'baz']);
  }

  /*
   * determine the searchMode for a given string
   */
  public getSearchMode(mode: string): SearchModeInterface {
    return this.searchMode;
  }

  /*
   * determine the initial searchState from the router state store
   * can  be constructed from various parameters like querystring, ... TBD
   */
  public getInitialSearchState(): Observable<SearchStateInterface> {
    return of(this.searchState);
  }

  /*
   * dispatch toggle action
   */
  public toggleFavoriteArea(area: LearningAreaInterface): void {}
}
