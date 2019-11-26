import { Inject, Injectable } from '@angular/core';
import {
  ClassGroupFixture,
  ClassGroupInterface,
  EduContent,
  EduContentFixture,
  EduContentInterface,
  EduContentProductTypeFixture,
  EduContentTOCFixture,
  EduContentTOCInterface,
  MethodYearsInterface,
  SearchResultInterface,
  SearchStateInterface,
  UnlockedFreePracticeInterface
} from '@campus/dal';
import { SearchModeInterface } from '@campus/search';
import {
  EnvironmentSearchModesInterface,
  ENVIRONMENT_SEARCHMODES_TOKEN
} from '@campus/shared';
import { ViewModelInterface } from '@campus/testing';
import {
  MultiCheckBoxTableItemColumnInterface,
  MultiCheckBoxTableItemInterface,
  MultiCheckBoxTableRowHeaderColumnInterface
} from '@campus/ui';
import { Dictionary } from '@ngrx/entity';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { CurrentPracticeParams, PracticeViewModel } from './practice.viewmodel';
import {
  ChapterWithStatusInterface,
  UnlockedBookInterface
} from './practice.viewmodel.selectors';

@Injectable({
  providedIn: 'root'
})
export class MockPracticeViewModel
  implements ViewModelInterface<PracticeViewModel> {
  public searchResults$: Observable<SearchResultInterface>;
  public searchState$ = new BehaviorSubject<SearchStateInterface>({
    searchTerm: '',
    filterCriteriaSelections: new Map<string, (string | number)[]>()
  });

  public methodYears$ = new BehaviorSubject<MethodYearsInterface[]>(
    this.getAllowedBooks$()
  );
  public currentPracticeParams$ = new BehaviorSubject<CurrentPracticeParams>(
    {}
  );
  public bookTitle$ = new BehaviorSubject<string>('Katapult 1');
  public currentChapter$ = new BehaviorSubject<EduContentTOCInterface>(
    this.getBookChapters()[0]
  );
  public chapterLessons$ = new BehaviorSubject<EduContentTOCInterface[]>(
    this.getLessons()
  );

  public bookChapters$ = new BehaviorSubject<EduContentTOCInterface[]>(
    this.getBookChapters()
  );
  public filteredClassGroups$ = new BehaviorSubject<ClassGroupInterface[]>(
    this.getClassGroups()
  );
  public unlockedBooks$ = new BehaviorSubject<UnlockedBookInterface[]>(
    this.getUnlockedBooks()
  );

  //Multi-check-box-table streams
  public unlockedFreePracticeByEduContentTOCId$ = new BehaviorSubject<
    Dictionary<UnlockedFreePracticeInterface[]>
  >(null);
  public unlockedFreePracticeByEduContentBookId$ = new BehaviorSubject<
    Dictionary<UnlockedFreePracticeInterface[]>
  >(null);
  public unlockedFreePracticeTableRowHeaders: MultiCheckBoxTableRowHeaderColumnInterface<
    EduContentTOCInterface
  >[] = [{ caption: 'Hoofdstuk', key: 'title' }];
  public unlockedFreePracticeTableItemColumns$ = new BehaviorSubject<
    MultiCheckBoxTableItemColumnInterface<ClassGroupInterface>[]
  >([
    {
      item: this.getClassGroups()[0],
      key: 'id',
      label: 'name'
    },
    {
      item: this.getClassGroups()[1],
      key: 'id',
      label: 'name'
    }
  ]);
  public unlockedFreePracticeTableItems$ = new BehaviorSubject<
    MultiCheckBoxTableItemInterface<EduContentTOCInterface>[]
  >([
    {
      header: this.getBookChapters()[0],
      content: { 1: true, 2: false }
    },
    {
      header: this.getBookChapters()[1],
      content: { 1: false, 2: true }
    },
    {
      header: this.getBookChapters()[2],
      content: { 1: false, 2: false }
    }
  ]);

  public bookChaptersWithStatus$ = new BehaviorSubject<
    ChapterWithStatusInterface[]
  >(this.getChaptersWithStatus(20));

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

  public toggleUnlockedFreePractice(): void {}

  public updateState(state: SearchStateInterface): void {}

  openEduContentAsExercise(eduContent: any): void {}
  openEduContentAsSolution(eduContent: EduContent): void {}
  openEduContentAsStream(eduContent: EduContent): void {}
  openEduContentAsDownload(eduContent: EduContent): void {}
  openBoeke(eduContent: EduContent): void {}

  /*
   *
   */
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
        ['methods', new Map([[34, 3], [2, 50]])],
        ['eduContentTOC', new Map()],
        ['methodLevel', new Map()]
      ])
    });
  }

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

  private getUnlockedBooks() {
    return [
      {
        bookId: 1,
        logoUrl: 'assets/methods/beaufort.jpg',
        name: 'Beaufort',
        learningAreaName: 'Frans'
      },
      {
        bookId: 1,
        logoUrl: 'assets/methods/katapult.jpg',
        name: 'Katapult',
        learningAreaName: 'Wiskunde'
      }
    ];
  }

  private getClassGroups() {
    return [
      new ClassGroupFixture({ id: 1, name: '1a' }),
      new ClassGroupFixture({ id: 2, name: '1b' })
    ];
  }

  private getBookChapters() {
    return [
      new EduContentTOCFixture({
        id: 1,
        title: 'Hoofdstuk 1',
        lft: 1,
        rgt: 10
      }),
      new EduContentTOCFixture({ id: 6, title: 'Hoofdstuk 2' }),
      new EduContentTOCFixture({ id: 3, title: 'Hoofdstuk 3' })
    ];
  }

  private getChaptersWithStatus(amount: number = 10) {
    return Array.from(new Array(amount).keys()).map(key => ({
      tocId: key + 1,
      title: 'Hoofdstuk ' + (key + 1),
      exercises: {
        available: amount,
        completed: amount - key
      },
      kwetonsRemaining: key * 3 * 10
    }));
  }

  private getLessons() {
    return [
      new EduContentTOCFixture({
        id: 2,
        title: 'Les 1',
        lft: 2,
        rgt: 9,
        treeId: 1,
        depth: 1
      }),
      new EduContentTOCFixture({
        id: 3,
        title: 'Les 2',
        lft: 3,
        rgt: 8,
        treeId: 1,
        depth: 1
      }),
      new EduContentTOCFixture({
        id: 4,
        title: 'Les 3',
        lft: 4,
        rgt: 7,
        treeId: 1,
        depth: 1
      }),
      new EduContentTOCFixture({
        id: 5,
        title: 'Les 4',
        lft: 5,
        rgt: 6,
        treeId: 1,
        depth: 1
      })
    ];
  }
}
