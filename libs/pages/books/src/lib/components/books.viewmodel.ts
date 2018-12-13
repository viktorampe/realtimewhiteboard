import { Inject, Injectable } from '@angular/core';
import {
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  ContentInterface,
  DalState,
  EduContent,
  EduContentQueries,
  LearningAreaQueries,
  UiActions,
  UiQuery,
  UnlockedBoekeGroupQueries,
  UnlockedBoekeStudentQueries
} from '@campus/dal';
import {
  OpenStaticContentServiceInterface,
  OPEN_STATIC_CONTENT_SERVICE_TOKEN
} from '@campus/shared';
import { ListFormat } from '@campus/ui';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BooksViewModel {
  listFormat$: Observable<ListFormat>;
  sharedBooks$: Observable<EduContent[]>;

  constructor(
    private store: Store<DalState>,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface,
    @Inject(OPEN_STATIC_CONTENT_SERVICE_TOKEN)
    private openStaticContentService: OpenStaticContentServiceInterface
  ) {
    this.initialize();
  }

  initialize() {
    this.listFormat$ = this.getListFormat();
    this.sharedBooks$ = this.getSharedBooks();
  }

  changeListFormat(listFormat: ListFormat): void {
    this.store.dispatch(new UiActions.SetListFormat({ listFormat }));
  }


  openBook(content: ContentInterface): void {
    this.openStaticContentService.open(content);
  }

  private getListFormat(): Observable<ListFormat> {
    return this.store.pipe(select(UiQuery.getListFormat));
  }

  private getSharedBooks(): Observable<EduContent[]> {
    const props = { userId: this.authService.userId };

    return combineLatest(
      this.store.pipe(select(UnlockedBoekeGroupQueries.getShared, props)),
      this.store.pipe(select(UnlockedBoekeStudentQueries.getShared, props)),
      this.store.pipe(select(LearningAreaQueries.getAllEntities)),
      this.store.pipe(select(EduContentQueries.getAll))
    ).pipe(
      map(([ubGroups, ubStudents, areaEntities, eduContents]) => {
        // get and filter all eduContent to make use of the default sorting
        const ids = new Set([
          ...ubGroups.map(g => g.eduContentId),
          ...ubStudents.map(s => s.eduContentId)
        ]);
        return eduContents
          .filter(eduContent => ids.has(eduContent.id))
          .map(book => {
            const metadata = book.publishedEduContentMetadata;
            // return copy, don't update original book by reference
            return <EduContent>{
              ...book,
              publishedEduContentMetadata: {
                ...metadata,
                learningArea: areaEntities[metadata.learningAreaId]
              }
            };
          });
      }),
      shareReplay(1)
    );
  }
}
