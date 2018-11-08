import { Inject, Injectable } from '@angular/core';
import {
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  BundleInterface,
  BundleQueries,
  ContentInterface,
  DalState,
  EduContentQueries,
  LearningAreaInterface,
  LearningAreaQueries,
  PersonInterface,
  UiActions,
  UiQuery,
  UnlockedBoekeGroupQueries,
  UnlockedBoekeStudentQueries,
  UnlockedContentInterface,
  UnlockedContentQueries,
  UserContentQueries
} from '@campus/dal';
import { ListFormat } from '@campus/ui';
import { Dictionary } from '@ngrx/entity';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable, of } from 'rxjs';
import { filter, map, shareReplay, switchMap } from 'rxjs/operators';
import {
  BundlesWithContentInfoInterface,
  LearningAreasWithBundlesInfoInterface
} from './bundles.viewmodel.interfaces';

@Injectable({
  providedIn: 'root'
})
export class BundlesViewModel {
  // source streams
  listFormat$: Observable<ListFormat>;
  private learningAreas$: Observable<LearningAreaInterface[]>;

  // intermediate streams (maps)
  // > learningareas page
  private sharedBundles$: Observable<BundleInterface[]>;
  private sharedBundlesByLearningArea$: Observable<
    Dictionary<BundleInterface[]>
  >;
  private sharedBooks$: Observable<ContentInterface[]>;
  private sharedBooksByLearningArea$: Observable<
    Dictionary<ContentInterface[]>
  >;
  // > bundles page
  // private learningAreaId$: Observable<number>;
  private unlockedContentsByBundle$: Observable<
    Dictionary<UnlockedContentInterface[]>
  >;
  // > bundle detail page
  // private bundleId$: Observable<number>;

  // presentation streams
  // > learningareas page
  sharedLearningAreas$: Observable<LearningAreasWithBundlesInfoInterface>;
  // TODO: contentstatus

  constructor(
    private store: Store<DalState>,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface
  ) {
    this.initialize();
  }

  initialize(): void {
    // source streams
    this.listFormat$ = this.store.pipe(
      select(UiQuery.getListFormat),
      map(listFormat => <ListFormat>listFormat)
    );
    this.learningAreas$ = this.store.pipe(select(LearningAreaQueries.getAll));

    // intermediate streams
    // > learningarea page
    this.sharedBundles$ = this.getSharedBundles();
    this.sharedBundlesByLearningArea$ = this.groupStreamByKey(
      this.sharedBundles$,
      'learningAreaId'
    );
    this.sharedBooks$ = this.getSharedBooks();
    this.sharedBooksByLearningArea$ = this.groupStreamByKey(
      this.sharedBooks$,
      'publishedEduContentMetadata.learningAreaId'
    );
    // > bundles page
    this.unlockedContentsByBundle$ = this.store.pipe(
      select(UnlockedContentQueries.getByBundleIds)
    );

    // presentation streams
    // > learningarea page
    this.sharedLearningAreas$ = this.getLearningAreasWithBundleInfo(
      this.sharedBundlesByLearningArea$,
      this.sharedBooksByLearningArea$
    );
  }

  changeListFormat(listFormat: ListFormat): void {
    this.store.dispatch(new UiActions.SetListFormatUi({ listFormat }));
  }

  getLearningAreaById(areaId: number): Observable<LearningAreaInterface> {
    return this.store.pipe(select(LearningAreaQueries.getById, { id: areaId }));
  }

  getBundleById(bundleId: number): Observable<BundleInterface> {
    return this.store.pipe(select(BundleQueries.getById, { id: bundleId }));
  }

  getBundleOwner(
    bundle$: Observable<BundleInterface>
  ): Observable<PersonInterface> {
    return bundle$.pipe(
      switchMap(
        (bundle): Observable<PersonInterface> =>
          // TODO implement personqueries
          // this.store.pipe(select(PersonQueries.getById, { id: bundle.teacherId }))
          of({
            id: 1,
            firstName: 'foo',
            name: 'bar',
            displayName: 'foo bar',
            email: '',
            avatar: null
          })
      )
    );
  }

  getBundleContents(bundleId: number): Observable<ContentInterface[]> {
    return this.unlockedContentsByBundle$.pipe(
      map(unlockedContentsMap => unlockedContentsMap[bundleId]),
      filter(unlockedContents => !!unlockedContents), // check if bundle exists
      switchMap(
        (unlockedContents): Observable<ContentInterface[]> =>
          combineLatest(
            ...unlockedContents.sort((a, b) => a.index - b.index).map(
              (unlockedContent): Observable<ContentInterface> => {
                if (unlockedContent.eduContentId) {
                  return this.store.pipe(
                    select(EduContentQueries.getById, {
                      id: unlockedContent.eduContentId
                    })
                  );
                }
                if (unlockedContent.userContentId) {
                  return this.store.pipe(
                    select(UserContentQueries.getById, {
                      id: unlockedContent.userContentId
                    })
                  );
                }
              }
            )
          )
      ),
      shareReplay(1)
    );
  }

  private getSharedBundles(): Observable<BundleInterface[]> {
    return this.store.pipe(
      select(BundleQueries.getShared, { userId: this.authService.userId })
    );
  }

  private getSharedBooks(): Observable<ContentInterface[]> {
    return combineLatest(
      this.store.pipe(
        select(UnlockedBoekeGroupQueries.getShared, {
          userId: this.authService.userId
        })
      ),
      this.store.pipe(
        select(UnlockedBoekeStudentQueries.getShared, {
          userId: this.authService.userId
        })
      )
    ).pipe(
      switchMap(
        ([unlockedBookGroups, unlockedBookStudents]): Observable<
          ContentInterface[]
        > =>
          this.store.pipe(
            select(EduContentQueries.getByIds, {
              // extract all IDs from unlockedBook arrays (remove duplicates)
              ids: Array.from(
                new Set([
                  ...unlockedBookGroups.map(g => g.eduContentId),
                  ...unlockedBookStudents.map(s => s.eduContentId)
                ])
              )
            })
          )
      ),
      map(
        (eduContents): ContentInterface[] => {
          return eduContents.sort((a, b) => {
            const nameA = a.name && a.name.toLowerCase();
            const nameB = b.name && b.name.toLowerCase();
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
            return 0;
          });
        }
      ),
      shareReplay(1)
    );
  }

  private getLearningAreasWithBundleInfo(
    bundlesByLearningArea$: Observable<Dictionary<BundleInterface[]>>,
    booksByLearningArea$: Observable<Dictionary<ContentInterface[]>>
  ): Observable<LearningAreasWithBundlesInfoInterface> {
    return combineLatest(
      this.learningAreas$,
      bundlesByLearningArea$,
      booksByLearningArea$
    ).pipe(
      map(
        ([
          learningAreas,
          bundlesByLearningArea,
          booksByLearningArea
        ]): LearningAreasWithBundlesInfoInterface => {
          return {
            learningAreas: learningAreas
              .map(learningArea => ({
                learningArea: learningArea,
                bundleCount: bundlesByLearningArea[learningArea.id]
                  ? bundlesByLearningArea[learningArea.id].length
                  : 0,
                bookCount: booksByLearningArea[learningArea.id]
                  ? booksByLearningArea[learningArea.id].length
                  : 0
              }))
              .filter(
                learningArea =>
                  learningArea.bundleCount > 0 || learningArea.bookCount > 0
              )
          };
        }
      ),
      shareReplay(1)
    );
  }

  getSharedBundlesWithContentInfo(
    learningAreaId: number
  ): Observable<BundlesWithContentInfoInterface> {
    return this.getBundlesWithContentInfo(
      learningAreaId,
      this.sharedBundlesByLearningArea$,
      this.sharedBooksByLearningArea$,
      this.unlockedContentsByBundle$
    );
  }

  private getBundlesWithContentInfo(
    learningAreaId: number,
    bundlesByLearningArea$: Observable<Dictionary<BundleInterface[]>>,
    booksByLearningArea$: Observable<Dictionary<ContentInterface[]>>,
    unlockedContentsByBundle$: Observable<
      Dictionary<UnlockedContentInterface[]>
    >
  ) {
    return combineLatest(
      bundlesByLearningArea$,
      booksByLearningArea$,
      unlockedContentsByBundle$
    ).pipe(
      map(
        ([bundlesByArea, booksByArea, unlockedContentsByBundle]: [
          Dictionary<BundleInterface[]>,
          Dictionary<ContentInterface[]>,
          Dictionary<UnlockedContentInterface[]>
        ]): BundlesWithContentInfoInterface => {
          return {
            bundles: (bundlesByArea[learningAreaId] || []).map(bundle => ({
              bundle: bundle,
              contentsCount: (unlockedContentsByBundle[bundle.id] || []).length
            })),
            books: booksByArea[learningAreaId] || []
          };
        }
      ),
      shareReplay(1)
    );
  }

  private groupStreamByKey<T>(
    stream$: Observable<T[]>,
    key: string
  ): Observable<Dictionary<T[]>> {
    return stream$.pipe(
      map(
        (arr: T[]): Dictionary<T[]> => {
          const byKey = {};
          const keys = key.split('.');
          arr.forEach(item => {
            const prop = keys.reduce((p, k) => p[k] || '', item);
            if (!byKey[prop]) {
              byKey[prop] = [];
            }
            byKey[prop].push(item);
          });
          return byKey;
        }
      ),
      shareReplay(1)
    );
  }
}
