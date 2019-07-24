import { Inject, Injectable } from '@angular/core';
import {
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  ContentInterface,
  DalState,
  EduContent,
  EduContentQueries,
  LearningAreaQueries,
  MethodQueries,
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
import { map, shareReplay, switchMap } from 'rxjs/operators';

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
    return combineLatest([
      this.store.pipe(
        select(UnlockedBoekeGroupQueries.getShared, {
          userId: this.authService.userId
        })
      ),
      this.store.pipe(
        select(UnlockedBoekeStudentQueries.getShared, {
          userId: this.authService.userId
        })
      ),
      this.store.pipe(select(LearningAreaQueries.getAllEntities)),
      this.store.pipe(select(MethodQueries.getAllEntities))
    ]).pipe(
      switchMap(
        ([
          unlockedBookGroups,
          unlockedBookStudents,
          areaEntities,
          methodEntities
        ]): Observable<EduContent[]> =>
          this.store.pipe(
            select(EduContentQueries.getByIds, {
              // extract all IDs from unlockedBook arrays (remove duplicates)
              ids: Array.from(
                new Set([
                  ...unlockedBookGroups.map(g => g.eduContentId),
                  ...unlockedBookStudents.map(s => s.eduContentId)
                ])
              )
            }),
            map(eduContents =>
              eduContents.map(book => {
                const metadata = book.publishedEduContentMetadata;
                // return copy, don't update original book by reference
                // needs Object.assign to preserve getter-functions
                return Object.assign(book, {
                  publishedEduContentMetadata: {
                    ...metadata,
                    learningArea: areaEntities[metadata.learningAreaId],
                    methods: metadata.methodIds.map(
                      methodId => methodEntities[methodId]
                    )
                  }
                });
              })
            )
          )
      ),
      shareReplay(1)
    );
  }
}
