import { Injectable } from '@angular/core';
import {
  EduContent,
  EduContentBookFixture,
  EduContentBookInterface,
  EduContentFixture,
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
import { BehaviorSubject, Observable } from 'rxjs';
import { MethodViewModel } from './method.viewmodel';

@Injectable({
  providedIn: 'root'
})
export class MockMethodViewModel
  implements ViewModelInterface<MethodViewModel> {
  public searchResults$: Observable<SearchResultInterface>;
  public searchState$: Observable<SearchStateInterface>;
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

  public getSearchMode(mode: string): Observable<SearchModeInterface> {
    return;
  }

  public getInitialSearchState(): Observable<SearchStateInterface> {
    return;
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
}
