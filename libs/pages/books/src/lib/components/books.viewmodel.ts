import { Inject, Injectable } from '@angular/core';
import {
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  DalState,
  EduContent,
  EduContentQueries,
  LearningAreaInterface,
  LearningAreaQueries,
  UiActions,
  UiQuery,
  UnlockedBoekeGroup,
  UnlockedBoekeGroupInterface,
  UnlockedBoekeGroupQueries,
  UnlockedBoekeStudent,
  UnlockedBoekeStudentInterface,
  UnlockedBoekeStudentQueries
} from '@campus/dal';
import { ListFormat } from '@campus/ui';
import { Dictionary } from '@ngrx/entity';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BooksViewModel {
  listFormat$: Observable<ListFormat>;
  sharedBooks$: Observable<EduContent[]>;

  private learningAreas$: Observable<Dictionary<LearningAreaInterface>>;
  private unlockedBoekeGroups$: Observable<UnlockedBoekeGroup[]>;
  private unlockedBoekeStudents$: Observable<UnlockedBoekeStudent[]>;

  constructor(
    private store: Store<DalState>,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface
  ) {
    this.initialize();
  }

  initialize() {
    this.listFormat$ = this.getListFormat();
    this.learningAreas$ = this.getLearningAreas();
    this.unlockedBoekeGroups$ = this.getUnlockedBoekeGroups();
    this.unlockedBoekeStudents$ = this.getUnlockedBoekeStudent();
    this.sharedBooks$ = this.getSharedBooks();
  }

  changeListFormat(listFormat: ListFormat): void {
    this.store.dispatch(new UiActions.SetListFormat({ listFormat }));
  }

  private getListFormat(): Observable<ListFormat> {
    return this.store.pipe(select(UiQuery.getListFormat));
  }

  private getLearningAreas(): Observable<Dictionary<LearningAreaInterface>> {
    return this.store.pipe(select(LearningAreaQueries.getAllEntities));
  }

  private getUnlockedBoekeGroups(): Observable<UnlockedBoekeGroupInterface[]> {
    return this.store.pipe(
      select(UnlockedBoekeGroupQueries.getShared, {
        userId: this.authService.userId
      })
    );
  }

  private getUnlockedBoekeStudent(): Observable<
    UnlockedBoekeStudentInterface[]
  > {
    return this.store.pipe(
      select(UnlockedBoekeStudentQueries.getShared, {
        userId: this.authService.userId
      })
    );
  }

  private getSharedBooks(): Observable<EduContent[]> {
    return combineLatest(
      this.unlockedBoekeGroups$,
      this.unlockedBoekeStudents$
    ).pipe(
      switchMap(
        ([ubGroups, ubStudents]): Observable<EduContent[]> => {
          const ids = Array.from([
            // remove duplicate ids
            ...ubGroups.map(g => g.eduContentId),
            ...ubStudents.map(s => s.eduContentId)
          ]);
          return this.store.pipe(select(EduContentQueries.getByIds, { ids }));
        }
      ),
      switchMap(this.addLearningAreaToBooks),
      shareReplay(1)
    );
  }

  private addLearningAreaToBooks(
    books: EduContent[]
  ): Observable<EduContent[]> {
    return this.learningAreas$.pipe(
      map(learningAreas => {
        return books.map(book => {
          const metadata = book.publishedEduContentMetadata;
          if (!metadata) {
            return book;
          }
          // return copy, don't update original book by reference
          return <EduContent>{
            ...book,
            publishedEduContentMetadata: {
              ...metadata,
              learningArea: learningAreas[metadata.learningAreaId]
            }
          };
        });
      })
    );
  }
}
