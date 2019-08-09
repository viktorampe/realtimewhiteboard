import { Inject, Injectable } from '@angular/core';
import {
  ClassGroupFixture,
  ClassGroupInterface,
  EduContent,
  EduContentBookFixture,
  EduContentBookInterface,
  EduContentFixture,
  EduContentInterface,
  EduContentProductTypeFixture,
  EduContentProductTypeInterface,
  EduContentTOCFixture,
  EduContentTOCInterface,
  LearningPlanGoalFixture,
  LearningPlanGoalInterface,
  MethodFixture,
  MethodInterface,
  MethodYearsInterface,
  UserLessonFixture,
  UserLessonInterface
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
import {
  MultiCheckBoxTableItemInterface,
  MultiCheckBoxTableRowHeaderColumnInterface,
  MultiCheckBoxTableSubLevelInterface
} from '@campus/ui';
import { Dictionary } from '@ngrx/entity';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { CurrentMethodParams, MethodViewModel } from './method.viewmodel';

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
  public currentTab$ = new BehaviorSubject<number>(0);
  public currentMethodParams$ = new BehaviorSubject<CurrentMethodParams>({});

  public eduContentProductTypes$ = new BehaviorSubject<
    EduContentProductTypeInterface[]
  >(this.getEduContentProductTypes());
  public generalFilesByType$ = new BehaviorSubject<Dictionary<EduContent[]>>(
    this.getGeneralFilesByType()
  );
  public classGroups$ = new BehaviorSubject<ClassGroupInterface[]>([
    new ClassGroupFixture({ id: 1, name: '1a' }),
    new ClassGroupFixture({ id: 2, name: '1b' })
  ]);

  public methodWithYearByBookId$ = new BehaviorSubject<string>(
    'Beaufort 1e leerjaar'
  );

  public filteredClassGroups$ = new BehaviorSubject<ClassGroupInterface[]>([
    new ClassGroupFixture({ id: 1, name: '1a' }),
    new ClassGroupFixture({ id: 2, name: '1b' })
  ]);

  public userLessons$ = new BehaviorSubject<UserLessonInterface[]>([
    new UserLessonFixture({ id: 1, description: 'project verkeersveiligheid' }),
    new UserLessonFixture({ id: 2, description: 'excursie bos' }),
    new UserLessonFixture({ id: 3, description: 'schoolfeest' })
  ]);

  public staticTableHeaders: MultiCheckBoxTableRowHeaderColumnInterface<
    LearningPlanGoalInterface
  >[] = [
    { caption: 'prefix', key: 'prefix' },
    { caption: 'beschrijving', key: 'goal' }
  ];

  public learningPlanGoalsWithSelectionForClassGroups$ = new BehaviorSubject<
    MultiCheckBoxTableItemInterface<LearningPlanGoalInterface>[]
  >(this.getLearningPlanGoals().map(goal => ({ header: goal, content: {} })));

  public learningPlanGoalsPerLessonWithSelectionForClassGroups$ = new BehaviorSubject<
    MultiCheckBoxTableSubLevelInterface<
      EduContentTOCInterface,
      LearningPlanGoalInterface
    >[]
  >(
    this.getTOCs().map(toc => ({
      item: toc,
      label: 'title',
      children: this.getLearningPlanGoals().map(goal => ({
        header: goal,
        content: {}
      }))
    }))
  );

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

  private getLearningPlanGoals(): LearningPlanGoalInterface[] {
    return [
      new LearningPlanGoalFixture({
        id: 1,
        goal:
          'Spreekstrategie: zich blijven concentreren ondanks het feit dat ze niet alles kunnen uitdrukken.',
        uniqueIdentifier: 'd4e4085f-f008-471a-9d80-ce6a60088d7b',
        prefix: '5.15.2',
        type: 'leerplandoelstelling',
        learningAreaId: 1,
        learningDomainId: 18,
        eduNetId: 1
      }),
      new LearningPlanGoalFixture({
        id: 2,
        goal:
          'De leerlingen kunnen het algemeen onderwerp bepalen in informatieve, narratieve ' +
          'en artistiek-literaire teksten.',
        uniqueIdentifier: 'f1c37bd2-a2c0-46ed-a732-82f27300f69f',
        prefix: '5.1.',
        type: 'leerplandoelstelling',
        learningAreaId: 1,
        learningDomainId: 17,
        eduNetId: 1
      }),
      new LearningPlanGoalFixture({
        id: 3,
        goal:
          'De leerlingen kunnen de hoofdgedachte achterhalen in informatieve en narratieve teksten. ',
        uniqueIdentifier: '9386d059-9432-4d2f-aabb-ad84053ee3fc',
        prefix: '5.1. BIS',
        type: 'leerplandoelstelling',
        learningAreaId: 1,
        learningDomainId: 17,
        eduNetId: 1
      }),
      new LearningPlanGoalFixture({
        id: 4,
        goal:
          'De leerlingen kunnen het algemeen onderwerp bepalen in informatieve, narratieve ' +
          'en artistiek-literaire teksten.',
        uniqueIdentifier: 'f1c37bd2-a2c0-46ed-a732-82f27300f69f',
        prefix: '5.1.',
        type: 'leerplandoelstelling',
        learningAreaId: 1,
        learningDomainId: 17,
        eduNetId: 1
      }),
      new LearningPlanGoalFixture({
        id: 5,
        goal:
          'De leerlingen kunnen de hoofdgedachte achterhalen in informatieve en narratieve teksten. ',
        uniqueIdentifier: '9386d059-9432-4d2f-aabb-ad84053ee3fc',
        prefix: '5.1. BIS',
        type: 'leerplandoelstelling',
        learningAreaId: 1,
        learningDomainId: 17,
        eduNetId: 1
      })
    ];
  }
}
