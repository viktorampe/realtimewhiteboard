import { Injectable } from '@angular/core';
import {
  DalState,
  EduContent,
  LearningAreaInterface,
  LearningAreaQueries,
  UiActions,
  UiQuery,
  UnlockedBoekeGroup,
  UnlockedBoekeStudent
} from '@campus/dal';
import { ListFormat } from '@campus/ui';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MockBooksViewModel } from './books.viewmodel.mock';

@Injectable({
  providedIn: 'root'
})
export class BooksViewModel {
  listFormat$: Observable<ListFormat>;
  sharedBooks$: Observable<EduContent[]>;

  private learningAreas$: Observable<LearningAreaInterface[]>;
  private eduContents$: Observable<EduContent[]>;
  private unlockedBoekeGroups$: Observable<UnlockedBoekeGroup[]>;
  private unlockedBoekeStudents$: Observable<UnlockedBoekeStudent[]>;

  constructor(
    private vmMock: MockBooksViewModel,
    private store: Store<DalState>
  ) {
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

  changeListFormat(listFormat: ListFormat): void {
    this.store.dispatch(new UiActions.SetListFormat({ listFormat }));
  }
}
