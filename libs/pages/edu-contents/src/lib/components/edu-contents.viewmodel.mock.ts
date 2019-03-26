import { Injectable } from '@angular/core';
import {
  BundleFixture,
  EduContentFixture,
  LearningAreaFixture,
  LearningAreaInterface,
  TaskFixture
} from '@campus/dal';
import {
  FilterFactoryFixture,
  ResultItemBase,
  SearchModeInterface,
  SearchStateInterface
} from '@campus/search';
import { EduContentSearchResultInterface } from '@campus/shared';
import { ViewModelInterface } from '@campus/testing';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { EduContentsViewModel } from './edu-contents.viewmodel';

class ResultItemMock extends ResultItemBase {}

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

  private searchResults: EduContentSearchResultInterface[] = [
    {
      eduContent: new EduContentFixture(),
      inTask: false,
      currentTask: new TaskFixture(),
      inBundle: false,
      currentBundle: new BundleFixture(),
      isFavorite: true
    }
  ];

  private searchState: SearchStateInterface = {
    searchTerm: 'foo',
    filterCriteriaSelections: new Map<string, (number | string)[]>([
      ['learningArea', [1]]
    ]),
    from: 0
  };

  private searchMode: SearchModeInterface = {
    name: 'demo',
    label: 'demo',
    dynamicFilters: false,
    searchFilterFactory: FilterFactoryFixture,
    searchTerm: {
      // autocompleteEl: string; //reference to material autocomplete component
      domHost: 'hostSearchTerm'
    },
    results: {
      component: ResultItemMock,
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

  public searchTerm$ = new Subject<string>();
  public autoCompleteValues$ = new BehaviorSubject(['foo', 'bar']);
  public learningArea$ = new BehaviorSubject(this.learningAreas[0]);

  public learningAreas$ = new BehaviorSubject<LearningAreaInterface[]>(
    this.learningAreas
  );
  public favoriteLearningAreas$ = new BehaviorSubject<LearningAreaInterface[]>(
    this.favoriteLearningAreas
  );
  public searchResults$ = new BehaviorSubject<
    EduContentSearchResultInterface[]
  >(this.searchResults);

  public searchModes: { [key: string]: SearchModeInterface } = {
    demo: this.searchMode
  };

  /*
   * let the page component pass through the updated state from the search component
   */
  public updateState(state: SearchStateInterface) {}

  /*
   * make auto-complete request to api service and return observable
   */
  public requestAutoComplete(searchTerm: string): Observable<string[]> {
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

  public getLearningAreaById(): Observable<LearningAreaInterface> {
    return of(new LearningAreaFixture());
  }
}
