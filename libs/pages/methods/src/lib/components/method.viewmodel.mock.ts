import { Injectable } from '@angular/core';
import {
  EduContent,
  EduContentBookFixture,
  EduContentBookInterface,
  EduContentFixture,
  EduContentInterface,
  EduContentProductTypeFixture,
  EduContentProductTypeInterface,
  EduContentTOCFixture,
  EduContentTOCInterface,
  MethodFixture,
  MethodInterface,
  MethodYearsInterface
} from '@campus/dal';
import {
  SearchModeInterface,
  SearchResultInterface,
  SearchStateInterface
} from '@campus/search';
import { ViewModelInterface } from '@campus/testing';
import { Dictionary } from '@ngrx/entity';
import { EduContentSearchResultComponent } from 'apps/kabas-web/src/app/components/searchresults/edu-content-search-result.component';
import { ChapterLessonFilterFactory } from 'apps/kabas-web/src/app/factories/chapter-lesson-filter/chapter-lesson-filter.factory';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { MethodViewModel } from './method.viewmodel';

@Injectable({
  providedIn: 'root'
})
export class MockMethodViewModel
  implements ViewModelInterface<MethodViewModel> {
  public searchResults$: Observable<SearchResultInterface>;
  public searchState$ = new BehaviorSubject<SearchStateInterface>({
    searchTerm: '',
    filterCriteriaSelections: new Map<string, (string | number)[]>()
  });
  public methodYears$ = new BehaviorSubject<MethodYearsInterface[]>(
    this.getAllowedBooks$()
  );
  public currentToc$ = new BehaviorSubject<EduContentTOCInterface[]>(
    this.getTOCs()
  );
  public currentMethod$ = new BehaviorSubject<MethodInterface>(
    new MethodFixture({
      id: 1,
      name: 'Beaufort',
      logoUrl: 'beaufort.svg'
    })
  );
  public currentBoeke$ = new BehaviorSubject<EduContent>(
    new EduContentFixture()
  );
  public currentBook$ = new BehaviorSubject<EduContentBookInterface>(
    new EduContentBookFixture({
      diabolo: true
    })
  );

  public eduContentProductTypes$ = new BehaviorSubject<
    EduContentProductTypeInterface[]
  >(this.getEduContentProductTypes());
  public generalFilesByType$ = new BehaviorSubject<Dictionary<EduContent[]>>(
    this.getGeneralFilesByType()
  );

  constructor() {
    this.setupSearchResults();
  }

  public getSearchMode(mode: string): Observable<SearchModeInterface> {
    return of({
      name: 'chapter-lesson',
      label: 'Zoeken op <b>hoofdstuk</b>',
      dynamicFilters: false,
      searchTerm: {
        domHost: 'searchTerm'
      },
      searchFilterFactory: ChapterLessonFilterFactory,
      results: {
        component: EduContentSearchResultComponent,
        sortModes: [
          {
            description: 'alfabetisch',
            name: 'title.raw',
            icon: 'sort-alpha-down'
          }
        ],
        pageSize: 20
      }
    });
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

  private getAllowedBooks$(): MethodYearsInterface[] {
    return [
      {
        id: 1,
        logoUrl: 'beaufort.svg',
        name: 'testnaam',
        years: [
          {
            id: 1,
            name: 'L1',
            bookId: 2
          },
          {
            id: 2,
            name: 'L2',
            bookId: 3
          },
          {
            id: 3,
            name: 'L3',
            bookId: 4
          },
          {
            id: 4,
            name: 'L4',
            bookId: 5
          }
        ]
      },
      {
        id: 2,
        logoUrl: 'beaufort.svg',
        name: 'testnaam',
        years: [
          {
            id: 2,
            name: 'L2',
            bookId: 3
          },
          {
            id: 3,
            name: 'L3',
            bookId: 4
          },
          {
            id: 4,
            name: 'L4',
            bookId: 5
          }
        ]
      }
    ];
  }

  private getTOCs(): EduContentTOCInterface[] {
    return [
      new EduContentTOCFixture({ id: 1, treeId: 1, title: 'chapter 1' }),
      new EduContentTOCFixture({ id: 2, treeId: 1, title: 'chapter 2' }),
      new EduContentTOCFixture({ id: 3, treeId: 1, title: 'chapter 3' }),
      new EduContentTOCFixture({ id: 4, treeId: 1, title: 'chapter 4' })
    ];
  }

  private getGeneralFilesByType(): Dictionary<EduContent[]> {
    return {
      1: [
        new EduContentFixture(
          { id: 1 },
          { title: 'foo 1', fileExt: 'pdf', fileLabel: 'PDF' }
        ),
        new EduContentFixture(
          { id: 2 },
          { title: 'foo 2', fileExt: 'xls', fileLabel: 'Excel' }
        )
      ],
      3: [
        new EduContentFixture(
          { id: 3 },
          { title: 'foo 3', fileExt: 'pdf', fileLabel: 'PDF' }
        ),
        new EduContentFixture(
          { id: 4 },
          { title: 'foo 4', fileExt: 'pdf', fileLabel: 'PDF' }
        ),
        new EduContentFixture(
          { id: 5 },
          { title: 'foo 5', fileExt: 'pdf', fileLabel: 'PDF' }
        ),
        new EduContentFixture(
          { id: 6 },
          { title: 'foo 6', fileExt: 'pdf', fileLabel: 'PDF' }
        )
      ]
    };
  }

  private getEduContentProductTypes(): EduContentProductTypeInterface[] {
    return [
      new EduContentProductTypeFixture({ id: 1, name: 'type 1' }),
      new EduContentProductTypeFixture({ id: 2, name: 'type 2' }),
      new EduContentProductTypeFixture({ id: 3, name: 'type 3' })
    ];
  }

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
