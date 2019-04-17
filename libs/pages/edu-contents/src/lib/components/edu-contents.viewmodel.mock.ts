import { Component, Injectable } from '@angular/core';
import {
  BundleFixture,
  EduContentFixture,
  FavoriteFixture,
  LearningAreaFixture,
  LearningAreaInterface,
  TaskFixture
} from '@campus/dal';
import {
  FilterFactoryFixture,
  ResultItemBase,
  SearchModeInterface,
  SearchResultInterface,
  SearchStateInterface
} from '@campus/search';
import { EnvironmentSearchModesInterface } from '@campus/shared';
import { ViewModelInterface } from '@campus/testing';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { EduContentsViewModel } from './edu-contents.viewmodel';

@Component({
  selector: 'campus-result-item',
  template: '{{data}}'
})
export class ResultItemMockComponent extends ResultItemBase {}

@Injectable({
  providedIn: 'root'
})
export class EduContentsViewModelMock
  implements ViewModelInterface<EduContentsViewModel> {
  private learningAreas = [
    new LearningAreaFixture({
      id: 1,
      name: 'fooLearningArea',
      icon: 'polpo-aardrijkskunde'
    }),
    new LearningAreaFixture({
      id: 2,
      name: 'barLearningArea',
      icon: 'polpo-engels'
    }),
    new LearningAreaFixture({
      id: 3,
      name: 'bazLearningArea',
      icon: 'polpo-biologie'
    }),
    new LearningAreaFixture({
      id: 4,
      name: 'fooLearningArea',
      icon: 'polpo-aardrijkskunde'
    }),
    new LearningAreaFixture({
      id: 5,
      name: 'barLearningArea',
      icon: 'polpo-engels'
    }),
    new LearningAreaFixture({
      id: 6,
      name: 'bazLearningArea',
      icon: 'polpo-biologie'
    }),
    new LearningAreaFixture({
      id: 7,
      name: 'fooLearningArea',
      icon: 'polpo-aardrijkskunde'
    }),
    new LearningAreaFixture({
      id: 8,
      name: 'barLearningArea',
      icon: 'polpo-engels'
    }),
    new LearningAreaFixture({
      id: 9,
      name: 'bazLearningArea',
      icon: 'polpo-biologie'
    }),
    new LearningAreaFixture({
      id: 10,
      name: 'fooLearningArea',
      icon: 'polpo-aardrijkskunde'
    }),
    new LearningAreaFixture({
      id: 11,
      name: 'barLearningArea',
      icon: 'polpo-engels'
    }),
    new LearningAreaFixture({
      id: 12,
      name: 'bazLearningArea',
      icon: 'polpo-biologie'
    })
  ];

  private favoriteLearningAreas = [
    new LearningAreaFixture({
      id: 2,
      name: 'barLearningArea',
      icon: 'polpo-engels'
    }),
    new LearningAreaFixture({
      id: 3,
      name: 'bazLearningArea',
      icon: 'polpo-biologie'
    })
  ];

  private searchResults: SearchResultInterface = {
    results: [
      {
        eduContent: new EduContentFixture(),
        inTask: false,
        currentTask: new TaskFixture(),
        inBundle: false,
        currentBundle: new BundleFixture(),
        isFavorite: true
      }
    ],
    filterCriteriaPredictions: new Map(),
    count: 1
  };

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
      domHost: 'hostTop'
    },
    results: {
      component: ResultItemMockComponent,
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

  public searchState$ = new BehaviorSubject<SearchStateInterface>(
    this.searchState
  );
  public searchTerm$ = new Subject<string>();
  public autoCompleteValues$ = new BehaviorSubject(['foo', 'bar']);
  public learningArea$ = new BehaviorSubject(this.learningAreas[0]);

  public learningAreas$ = new BehaviorSubject<LearningAreaInterface[]>(
    this.learningAreas
  );
  public favoriteLearningAreas$ = new BehaviorSubject<LearningAreaInterface[]>(
    this.favoriteLearningAreas
  );
  public searchResults$ = new BehaviorSubject<SearchResultInterface>(
    this.searchResults
  );

  public eduContentFavorites$ = new BehaviorSubject([
    new FavoriteFixture({ id: 1, learningAreaId: 2, type: 'area' }),
    new FavoriteFixture({ id: 2, learningAreaId: 3, type: 'area' }),
    new FavoriteFixture({ id: 3, eduContentId: 1, type: 'educontent' }),
    new FavoriteFixture({ id: 4, eduContentId: 2, type: 'educontent' })
  ]);

  public searchModes: EnvironmentSearchModesInterface = {
    demo: this.searchMode,
    search: this.searchMode
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

  public saveSearchState(searchState: SearchStateInterface): void {}
}
