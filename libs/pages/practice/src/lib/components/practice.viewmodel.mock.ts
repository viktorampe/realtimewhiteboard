import { Injectable } from '@angular/core';
import {
  ClassGroupFixture,
  ClassGroupInterface,
  EduContentBookInterface,
  EduContentTOCFixture,
  EduContentTOCInterface,
  MethodYearsInterface,
  EduContentBookFixture
} from '@campus/dal';
import { ViewModelInterface } from '@campus/testing';
import {
  MultiCheckBoxTableItemColumnInterface,
  MultiCheckBoxTableItemInterface,
  MultiCheckBoxTableRowHeaderColumnInterface
} from '@campus/ui';
import { BehaviorSubject } from 'rxjs';
import { CurrentPracticeParams, PracticeViewModel } from './practice.viewmodel';
@Injectable({
  providedIn: 'root'
})
export class MockPracticeViewModel
  implements ViewModelInterface<PracticeViewModel> {
  public currentBook$ = new BehaviorSubject<EduContentBookInterface>(
    this.getBook()
  );
  public methodYears$ = new BehaviorSubject<MethodYearsInterface[]>(
    this.getAllowedBooks$()
  );
  public currentPracticeParams$ = new BehaviorSubject<CurrentPracticeParams>(
    {}
  );
  public bookTitle$ = new BehaviorSubject<string>('Katapult 1');
  public bookChapters$ = new BehaviorSubject<EduContentTOCInterface[]>(
    this.getBookChapters()
  );
  public filteredClassGroups$ = new BehaviorSubject<ClassGroupInterface[]>(
    this.getClassGroups()
  );

  //Multi-check-box-table streams
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

  constructor() {}

  public toggleUnlockedFreePractice(): void {}

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

  private getClassGroups() {
    return [
      new ClassGroupFixture({ id: 1, name: '1a' }),
      new ClassGroupFixture({ id: 2, name: '1b' })
    ];
  }

  private getBookChapters() {
    return [
      new EduContentTOCFixture({ id: 1, title: 'Hoofdstuk 1' }),
      new EduContentTOCFixture({ id: 2, title: 'Hoofdstuk 2' }),
      new EduContentTOCFixture({ id: 3, title: 'Hoofdstuk 3' })
    ];
  }

  private getBook() {
    return new EduContentBookFixture();
  }
}
