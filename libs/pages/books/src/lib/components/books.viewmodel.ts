import { Injectable } from '@angular/core';
import {
  DalState,
  EduContentInterface,
  LearningAreaInterface,
  UnlockedBoekeGroup,
  UnlockedBoekeStudent
} from '@campus/dal';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { BooksResolver } from './books.resolver';
import { MockBooksViewModel } from './books.viewmodel.mock';

@Injectable({
  providedIn: 'root'
})
export class BooksViewModel {
  // TODO change to <EduContent[]> when tasks branch is merged
  sharedBooks$: Observable<EduContentInterface[]>;

  private learningAreas$: Observable<LearningAreaInterface[]>;
  // TODO change to <EduContent[]> when tasks branch is merged
  private eduContents$: Observable<EduContentInterface[]>;
  private unlockedBoekeGroups$: Observable<UnlockedBoekeGroup[]>;
  private unlockedBoekeStudents$: Observable<UnlockedBoekeStudent[]>;

  constructor(
    private vmMock: MockBooksViewModel,
    private store: Store<DalState>,
    private booksResolver: BooksResolver
  ) {
    this.booksResolver.resolve();

    this.initialize();
  }

  initialize() {
    this.learningAreas$ = this.vmMock.learningAreas$;
    this.eduContents$ = this.vmMock.eduContents$;
    this.unlockedBoekeGroups$ = this.vmMock.unlockedBoekeGroups$;
    this.unlockedBoekeStudents$ = this.vmMock.unlockedBoekeStudents$;
    this.sharedBooks$ = this.vmMock.sharedBooks$;
  }
}
