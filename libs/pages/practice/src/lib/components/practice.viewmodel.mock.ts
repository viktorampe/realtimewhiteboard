import { Injectable } from '@angular/core';
import { MethodYearsInterface } from '@campus/dal';
import { ViewModelInterface } from '@campus/testing';
import { BehaviorSubject } from 'rxjs';
import { PracticeViewModel } from './practice.viewmodel';
@Injectable({
  providedIn: 'root'
})
export class MockPracticeViewModel
  implements ViewModelInterface<PracticeViewModel> {
  public methodYears$ = new BehaviorSubject<MethodYearsInterface[]>(
    this.getAllowedBooks$()
  );

  constructor() {}

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
