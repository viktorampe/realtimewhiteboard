import { Inject, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  BundleInterface,
  BundleQueries,
  ContentInterface,
  DalState,
  EduContentInterface,
  EduContentQueries,
  LearningAreaInterface,
  LearningAreaQueries,
  PersonInterface,
  UiActions,
  UiQuery,
  UnlockedBoekeGroupInterface,
  UnlockedBoekeGroupQueries,
  UnlockedBoekeStudentInterface,
  UnlockedBoekeStudentQueries,
  UnlockedContentInterface,
  UnlockedContentQueries,
  UserContentQueries,
  UserQueries
} from '@campus/dal';
import { ListFormat } from '@campus/ui';
import { Dictionary } from '@ngrx/entity';
import { select, Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { filter, map, shareReplay, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BundlesViewModel {
  // source streams
  learningAreaId$: Observable<number>;
  bundleId$: Observable<number>;

  listFormat$: Observable<ListFormat>;
  user$: Observable<PersonInterface>;
  learningAreas$: Observable<LearningAreaInterface[]>;
  bundles$: Observable<BundleInterface[]>;
  unlockedContents$: Observable<UnlockedContentInterface[]>;
  sharedUnlockedBookGroups$: Observable<UnlockedBoekeGroupInterface[]>;
  sharedUnlockedBookStudents$: Observable<UnlockedBoekeStudentInterface[]>;
  coupledPersons$: Observable<PersonInterface[]>;

  // intermediate streams (maps)
  bundlesByLearningArea$: Observable<Dictionary<BundleInterface[]>>;
  unlockedContentByBundle$: Observable<Dictionary<UnlockedContentInterface[]>>;

  // presentation streams
  // shared
  // > bundles
  activeBundle$: Observable<BundleInterface>;
  private sharedBundles$: Observable<BundleInterface[]>;
  sharedBundlesByLearningArea$: Observable<Dictionary<BundleInterface[]>>;
  bundleContentsCount$: Observable<Dictionary<number>>;
  bundleContents$: Observable<ContentInterface[]>;
  // > books
  private sharedBooks$: Observable<EduContentInterface[]>;
  sharedBooksByLearningArea$: Observable<Dictionary<ContentInterface[]>>;
  // > learningAreas
  activeLearningArea$: Observable<LearningAreaInterface>;
  sharedLearningAreas$: Observable<LearningAreaInterface[]>;
  sharedLearningAreasCount$: Observable<
    Dictionary<{
      bundlesCount: number;
      booksCount: number;
    }>
  >;
  sharedLearningAreaBundles$: Observable<BundleInterface[]>;
  sharedLearningAreaBooks$: Observable<ContentInterface[]>;

  // own (TODO teacher)
  // > bundles
  private ownBundles$: Observable<BundleInterface[]>;
  // > books
  private ownBooks$: Observable<EduContentInterface[]>;
  // > learningAreas
  learningAreasWithOwnBundles$: Observable<LearningAreaInterface[]>;

  constructor(
    private store: Store<DalState>,
    private route: ActivatedRoute,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface
  ) {
    this.initialize();
  }

  initialize(): void {
    this.learningAreaId$ = this.route.params.pipe(
      map((params): number => params.area || 0)
    );
    this.bundleId$ = this.route.params.pipe(
      map((params): number => params.bundle || 0)
    );

    this.user$ = this.store.pipe(select(UserQueries.getCurrentUser));
    this.coupledPersons$ = new BehaviorSubject([]); // TODO add TeacherStudent state

    this.listFormat$ = this.store.pipe(
      select(UiQuery.getListFormat),
      map(listFormat => <ListFormat>listFormat)
    );
    this.learningAreas$ = this.store.pipe(select(LearningAreaQueries.getAll));
    this.bundles$ = this.store.pipe(select(BundleQueries.getAll));
    this.unlockedContents$ = this.store.pipe(
      select(UnlockedContentQueries.getAll)
    );
    this.sharedUnlockedBookGroups$ = this.store.pipe(
      select(UnlockedBoekeGroupQueries.getShared)
    );
    this.sharedUnlockedBookStudents$ = this.store.pipe(
      select(UnlockedBoekeStudentQueries.getShared)
    );

    // intermediate streams
    this.bundlesByLearningArea$ = this.store.pipe(
      select(BundleQueries.getByLearningAreaId)
    );
    this.unlockedContentByBundle$ = this.store.pipe(
      select(UnlockedContentQueries.getByBundleIds)
    );

    // presentation streams
    // shared
    // > bundles
    this.activeBundle$ = this.bundleId$.pipe(
      switchMap(
        (bundleId: number): Observable<BundleInterface> =>
          this.store.pipe(select(BundleQueries.getById, { id: bundleId }))
      )
    );
    this.sharedBundles$ = this.getSharedBundles();
    this.sharedBundlesByLearningArea$ = this.groupStreamByKey(
      this.sharedBundles$,
      'learningAreaId'
    );
    this.sharedLearningAreaBundles$ = this.getLearningAreaBundles(
      this.learningAreaId$,
      this.sharedBundlesByLearningArea$
    );
    this.sharedLearningAreaBooks$ = this.getLearningAreaBooks(
      this.learningAreaId$,
      this.sharedBooksByLearningArea$
    );
    this.bundleContentsCount$ = this.getBundleContentsCount(
      this.unlockedContentByBundle$
    );
    this.bundleContents$ = this.getBundleContents(
      this.bundleId$,
      this.unlockedContentByBundle$
    );
    // > books
    this.sharedBooks$ = this.getSharedBooks();
    this.sharedBooksByLearningArea$ = this.groupStreamByKey(
      this.sharedBooks$,
      'learningAreaId'
    );
    // > learningAreas
    this.activeLearningArea$ = this.learningAreaId$.pipe(
      switchMap(
        (areaId: number): Observable<LearningAreaInterface> =>
          this.store.pipe(select(LearningAreaQueries.getById, { id: areaId }))
      )
    );
    this.sharedLearningAreas$ = this.getLearningAreasWithContent(
      this.sharedBundles$,
      this.sharedBooks$
    );
    this.sharedLearningAreasCount$ = this.getSharedLearningAreasCount(
      this.sharedLearningAreas$,
      this.sharedBundlesByLearningArea$,
      this.sharedBooksByLearningArea$
    );

    // own (TODO teacher)
    // > bundles
    this.ownBundles$ = this.getOwnBundles();
    // > books
    this.ownBooks$ = of([]); // TODO favorited books
    // > learningAreas
    this.learningAreasWithOwnBundles$ = this.getLearningAreasWithContent(
      this.ownBundles$,
      this.ownBooks$
    );
  }

  changeListFormat(listFormat: ListFormat): void {
    this.store.dispatch(new UiActions.SetListFormat({ listFormat }));
  }

  private getLearningAreaBundles(
    learningAreaId$: Observable<number>,
    bundlesByLearningArea$: Observable<Dictionary<BundleInterface[]>>
  ): Observable<BundleInterface[]> {
    return combineLatest(learningAreaId$, bundlesByLearningArea$).pipe(
      map(
        ([learningAreaId, bundlesByLearningArea]) =>
          bundlesByLearningArea[learningAreaId]
      ),
      filter(bundles => !!bundles) // check if bundle exists in learningArea
    );
  }

  private getLearningAreaBooks(
    learningAreaId$: Observable<number>,
    booksByLearningArea$: Observable<Dictionary<ContentInterface[]>>
  ): Observable<ContentInterface[]> {
    return combineLatest(learningAreaId$, booksByLearningArea$).pipe(
      map(
        ([learningAreaId, booksByLearningArea]) =>
          booksByLearningArea[learningAreaId]
      ),
      filter(books => !!books) // check if bundle exists in learningArea
    );
  }

  private getBundleContents(
    bundleId$: Observable<number>,
    unlockedContentByBundle$: Observable<Dictionary<UnlockedContentInterface[]>>
  ): Observable<ContentInterface[]> {
    return combineLatest(bundleId$, unlockedContentByBundle$).pipe(
      map(([bundleId, unlockedContentsMap]) => unlockedContentsMap[bundleId]),
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
    return this.user$.pipe(
      switchMap(user =>
        this.store.pipe(select(BundleQueries.getShared, { userId: user.id }))
      )
    );
  }

  private getSharedBooks(): Observable<EduContentInterface[]> {
    return this.user$.pipe(
      switchMap(user =>
        combineLatest(
          this.store.pipe(
            select(UnlockedBoekeGroupQueries.getShared, { userId: user.id })
          ),
          this.store.pipe(
            select(UnlockedBoekeStudentQueries.getShared, { userId: user.id })
          )
        )
      ),
      switchMap(([unlockedBookGroups, unlockedBookStudents]) =>
        this.store.pipe(
          select(EduContentQueries.getByIds, {
            ids: [
              // extract all IDs from unlockedBook arrays
              ...unlockedBookGroups.map(g => g.eduContentId),
              ...unlockedBookStudents.map(s => s.eduContentId)
            ]
          })
        )
      ),
      shareReplay(1)
    );
  }

  private getBundleContentsCount(
    unlockedContentByBundle$: Observable<Dictionary<UnlockedContentInterface[]>>
  ): Observable<Dictionary<number>> {
    return unlockedContentByBundle$.pipe(
      map(unlockedContentsByBundle => {
        const countByBundle = {};
        Object.keys(unlockedContentsByBundle).forEach(key => {
          countByBundle[key] = unlockedContentsByBundle[key].length;
        });
        return countByBundle;
      }),
      shareReplay(1)
    );
  }

  private getOwnBundles(): Observable<BundleInterface[]> {
    return this.user$.pipe(
      switchMap(user =>
        this.store.pipe(select(BundleQueries.getOwn, { userId: user.id }))
      )
    );
  }

  private getLearningAreaIdsWithContent(
    bundles$: Observable<BundleInterface[]>,
    books$: Observable<EduContentInterface[]>
  ): Observable<number[]> {
    return combineLatest(bundles$, books$).pipe(
      map(
        ([bundles, books]): number[] => {
          return [
            ...bundles.map(bundle => bundle.learningAreaId),
            ...books.map(
              book =>
                book.publishedEduContentMetadata &&
                book.publishedEduContentMetadata.learningAreaId
            )
          ].filter((v, i, n) => n.indexOf(v) === i);
        }
      ),
      shareReplay(1)
    );
  }

  private getLearningAreasWithContent(
    bundles$: Observable<BundleInterface[]>,
    books$: Observable<EduContentInterface[]>
  ): Observable<LearningAreaInterface[]> {
    return this.getLearningAreaIdsWithContent(bundles$, books$).pipe(
      switchMap(learningAreaIds => {
        return this.store.pipe(
          select(LearningAreaQueries.getByIds, { ids: learningAreaIds })
        );
      })
    );
  }

  private getSharedLearningAreasCount(
    learningAreas$: Observable<LearningAreaInterface[]>,
    sharedBundlesByLearningArea$: Observable<Dictionary<BundleInterface[]>>,
    sharedBooksByLearningArea$: Observable<Dictionary<ContentInterface[]>>
  ): Observable<
    Dictionary<{
      bundlesCount: number;
      booksCount: number;
    }>
  > {
    return combineLatest(
      learningAreas$,
      sharedBundlesByLearningArea$,
      sharedBooksByLearningArea$
    ).pipe(
      map(([learningAreas, bundles, books]) => {
        const learningAreaCounts = {};
        learningAreas.forEach(learningArea => {
          learningAreaCounts[learningArea.id] = {
            bundlesCount: bundles[learningArea.id]
              ? bundles[learningArea.id].length
              : 0,
            booksCount: books[learningArea.id]
              ? books[learningArea.id].length
              : 0
          };
        });
        return learningAreaCounts;
      }),
      shareReplay(1)
    );
  }

  private groupStreamByKey(
    stream$: Observable<any[]>,
    key: string
  ): Observable<Dictionary<any[]>> {
    return stream$.pipe(
      map(
        (arr: any[]): Dictionary<any[]> => {
          const byKey = {};
          arr.forEach(item => {
            if (!byKey[item[key]]) {
              byKey[item[key]] = [];
            }
            byKey[item[key]].push(item);
          });
          return byKey;
        }
      ),
      shareReplay(1)
    );
  }
}
