import { Inject, Injectable } from '@angular/core';
import {
  EduContent,
  EduContentFixture,
  EduContentInterface,
  EduContentProductTypeFixture
} from '@campus/dal';
import {
  SearchModeInterface,
  SearchResultInterface,
  SearchStateInterface
} from '@campus/search';
import {
  EnvironmentSearchModesInterface,
  ENVIRONMENT_SEARCHMODES_TOKEN
} from '@campus/shared';
import { ViewModelInterface } from '@campus/testing';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { GlobalSearchViewModel } from './global-search.viewmodel';

@Injectable({
  providedIn: 'root'
})
export class MockGlobalSearchViewModel
  implements ViewModelInterface<GlobalSearchViewModel> {
  public searchResults$: Observable<SearchResultInterface>;
  public searchState$ = new BehaviorSubject<SearchStateInterface>({
    searchTerm: '',
    filterCriteriaSelections: new Map<string, (string | number)[]>()
  });

  constructor(
    @Inject(ENVIRONMENT_SEARCHMODES_TOKEN)
    private searchModes: EnvironmentSearchModesInterface
  ) {
    this.setupSearchResults();
  }

  public getSearchMode(mode: string): Observable<SearchModeInterface> {
    return of(this.searchModes[mode]);
  }

  public getInitialSearchState(): Observable<SearchStateInterface> {
    return this.searchState$;
  }

  public requestAutoComplete(searchTerm: string): Observable<string[]> {
    return;
  }

  public updateState(state: SearchStateInterface): void {}

  openEduContentAsExercise(eduContent: any): void {}
  openEduContentAsSolution(eduContent: EduContent): void {}
  openEduContentAsStream(eduContent: EduContent): void {}
  openEduContentAsDownload(eduContent: EduContent): void {}
  openBoeke(eduContent: EduContent): void {}

  private setupSearchResults(): void {
    this.searchResults$ = this.getMockResults().pipe(
      map(searchResult => {
        return {
          ...searchResult,
          results: searchResult.results.map(
            (searchResultItem: EduContentInterface) => {
              const eduContent = Object.assign<EduContent, EduContentInterface>(
                new EduContent(),
                searchResultItem
              );

              return {
                eduContent: eduContent
                // add additional props for the resultItemComponent here
              };
            }
          )
        };
      })
    );
  }

  // tslint:disable-next-line: member-ordering
  private loadedMockResults = false;
  private getMockResults(): Observable<SearchResultInterface> {
    if (this.loadedMockResults) {
      return of({
        count: 3,
        results: [],
        filterCriteriaPredictions: new Map()
      });
    }
    this.loadedMockResults = true;

    const mockResults: EduContent[] = [
      new EduContentFixture(
        {},
        {
          title: 'Aanliggende hoeken',
          description:
            'In dit leerobject maken leerlingen 3 tikoefeningen op aanliggende hoeken.',
          fileExt: 'ludo.zip'
        }
      ),
      new EduContentFixture(
        {},
        {
          thumbSmall:
            'https://avatars3.githubusercontent.com/u/31932368?s=460&v=4'
        }
      ),
      new EduContentFixture(
        {},
        {
          eduContentProductType: new EduContentProductTypeFixture({
            pedagogic: true
          })
        }
      )
    ];

    for (let i = 0; i < 25; i++) {
      mockResults.push(
        new EduContentFixture(
          {},
          {
            title: 'Aanliggende hoeken',
            description:
              'In dit leerobject maken leerlingen 3 tikoefeningen op aanliggende hoeken.',
            fileExt: 'ludo.zip'
          }
        )
      );
    }

    return of({
      count: mockResults.length,
      results: mockResults,
      filterCriteriaPredictions: new Map([
        ['LearningArea', new Map([[1, 100], [2, 50]])]
      ])
    });
  }
}
