import { Injectable } from '@angular/core';
import {
  EduContent,
  EduContentBookInterface,
  EduContentProductTypeInterface,
  EduContentTOCFixture,
  EduContentTOCInterface,
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
  public currentToc$ = new BehaviorSubject<EduContentTOCInterface[]>([
    new EduContentTOCFixture({
      id: 1,
      treeId: 1,
      depth: 0,
      lft: 1,
      rgt: 6
    }),
    new EduContentTOCFixture({
      id: 2,
      treeId: 1,
      depth: 0,
      lft: 7,
      rgt: 10
    })
  ]);
  public currentMethod$ = new BehaviorSubject<MethodInterface>(null);
  public currentBoeke$ = new BehaviorSubject<EduContent>(null);
  public currentBook$ = new BehaviorSubject<EduContentBookInterface>(null);
  public eduContentProductTypes$ = new BehaviorSubject<
    EduContentProductTypeInterface[]
  >([]);
  public generalFilesByType$ = new BehaviorSubject<Dictionary<EduContent[]>>(
    {}
  );

  public getSearchMode(mode: string, book?: number): SearchModeInterface {
    return;
  }

  public getInitialSearchState(): Observable<SearchStateInterface> {
    return;
  }

  public updateState(state: SearchStateInterface): void {}

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
}
