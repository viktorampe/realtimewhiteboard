import { Injectable } from '@angular/core';
import {
  DalState,
  EduContentInterface,
  LearningAreaInterface,
  LearningAreaQueries,
  UiQuery,
  UnlockedBoekeGroup,
  UnlockedBoekeStudent
} from '@campus/dal';
import { ListFormat } from '@campus/ui';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { BooksResolver } from './books.resolver';
import { MockBooksViewModel } from './books.viewmodel.mock';

@Injectable({
  providedIn: 'root'
})
export class BooksViewModel {
  listFormat$: Observable<ListFormat>;

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
    this.listFormat$ = this.store.pipe(select(UiQuery.getListFormat));
    this.learningAreas$ = this.store.pipe(select(LearningAreaQueries.getAll));

    this.eduContents$ = this.vmMock.eduContents$;
    this.unlockedBoekeGroups$ = this.vmMock.unlockedBoekeGroups$;
    this.unlockedBoekeStudents$ = this.vmMock.unlockedBoekeStudents$;
    this.sharedBooks$ = this.vmMock.sharedBooks$;
  }
}
