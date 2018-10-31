import { Inject, Injectable } from '@angular/core';
import { ActivatedRoute, Resolve } from '@angular/router';
import {
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  BundleActions,
  BundleInterface,
  BundleQueries,
  ContentInterface,
  DalState,
  EduContentActions,
  EduContentInterface,
  EduContentQueries,
  LearningAreaActions,
  LearningAreaInterface,
  LearningAreaQueries,
  PersonInterface,
  UiActions,
  UiQuery,
  UnlockedBoekeGroupActions,
  UnlockedBoekeGroupInterface,
  UnlockedBoekeGroupQueries,
  UnlockedBoekeStudentActions,
  UnlockedBoekeStudentInterface,
  UnlockedBoekeStudentQueries,
  UnlockedContentActions,
  UnlockedContentInterface,
  UnlockedContentQueries,
  UserContentActions,
  UserContentQueries
} from '@campus/dal';
import { StateResolver } from '@campus/pages/shared';
import { ListFormat } from '@campus/ui';
import { Dictionary } from '@ngrx/entity';
import { Action, select, Selector, Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { filter, map, shareReplay, switchMap } from 'rxjs/operators';

export interface LearningAreaWithBundleInstanceInfo {
  learningAreas: {
    learningArea: LearningAreaInterface;
    bundleCount: number;
    bookCount: number;
  }[];
}

export interface BundleInstanceWithEduContentInfo extends BundleInterface {
  eduContentsCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class BundlesViewModel implements Resolve<boolean> {
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
  sharedLearningAreas$: Observable<LearningAreaWithBundleInstanceInfo>;
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
    private viewModelResolver: StateResolver,
    private store: Store<DalState>,
    private route: ActivatedRoute,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface
  ) {}

  resolve(): Observable<boolean> {
    this.learningAreaId$ = this.route.params.pipe(
      map((params): number => params.area || 0)
    );
    this.bundleId$ = this.route.params.pipe(
      map((params): number => params.bundle || 0)
    );

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
    // this.sharedLearningAreaBundles$ = this.getLearningAreaBundles(
    //   this.learningAreaId$,
    //   this.sharedBundlesByLearningArea$
    // );

    // > books
    this.sharedBooks$ = this.getSharedBooks();
    this.sharedBooksByLearningArea$ = this.sharedBooks$.pipe(
      map(sharedBooks => {
        const byArea = {};
        sharedBooks.forEach(book => {
          if (!byArea[book.publishedEduContentMetadata.learningAreaId]) {
            byArea[book.publishedEduContentMetadata.learningAreaId] = [];
          }
          byArea[book.publishedEduContentMetadata.learningAreaId].push(book);
        });
        return byArea;
      }),
      shareReplay(1)
    );
    // this.sharedLearningAreaBooks$ = this.getLearningAreaBooks(
    //   this.learningAreaId$,
    //   this.sharedBooksByLearningArea$
    // );

    this.bundleContentsCount$ = this.getBundleContentsCount(
      this.unlockedContentByBundle$
    );
    this.bundleContents$ = this.getBundleContents(
      this.bundleId$,
      this.unlockedContentByBundle$
    );

    // > learningAreas
    this.activeLearningArea$ = this.learningAreaId$.pipe(
      switchMap(
        (areaId: number): Observable<LearningAreaInterface> =>
          this.store.pipe(select(LearningAreaQueries.getById, { id: areaId }))
      )
    );
    this.sharedLearningAreas$ = this.getLearningAreasWithBundleInfo(
      this.sharedBundlesByLearningArea$,
      this.sharedBooksByLearningArea$
    );

    // // own (TODO teacher)
    // // > bundles
    // this.ownBundles$ = this.getOwnBundles();
    // // > books
    // this.ownBooks$ = of([]); // TODO favorited books
    // // > learningAreas
    // this.learningAreasWithOwnBundles$ = this.getLearningAreasWithBundleInfo(
    //   this.groupStreamByKey(this.ownBundles$, 'learningAreaId'),
    //   this.groupStreamByKey(this.ownBooks$, 'learningAreaId')
    // );

    return this.viewModelResolver.resolve(
      this.getLoadableActions(),
      this.getResolvedQueries()
    );
  }

  getLoadableActions(): Action[] {
    return [
      new LearningAreaActions.LoadLearningAreas(),
      new BundleActions.LoadBundles({ userId: this.authService.userId }),
      new EduContentActions.LoadEduContents({
        userId: this.authService.userId
      }),
      new UserContentActions.LoadUserContents({
        userId: this.authService.userId
      }),
      new UnlockedContentActions.LoadUnlockedContents({
        userId: this.authService.userId
      }),
      new UnlockedBoekeGroupActions.LoadUnlockedBoekeGroups({
        userId: this.authService.userId
      }),
      new UnlockedBoekeStudentActions.LoadUnlockedBoekeStudents({
        userId: this.authService.userId
      })
    ];
  }

  getResolvedQueries(): Selector<object, boolean>[] {
    return [
      LearningAreaQueries.getLoaded,
      BundleQueries.getLoaded,
      EduContentQueries.getLoaded,
      UserContentQueries.getLoaded,
      UnlockedContentQueries.getLoaded,
      UnlockedBoekeGroupQueries.getLoaded,
      UnlockedBoekeStudentQueries.getLoaded
    ];
  }

  changeListFormat(listFormat: ListFormat): void {
    this.store.dispatch(new UiActions.SetListFormatUi({ listFormat }));
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
    return this.store.pipe(
      select(BundleQueries.getShared, { userId: this.authService.userId })
    );
  }

  private getSharedBooks(): Observable<EduContentInterface[]> {
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
      switchMap(([unlockedBookGroups, unlockedBookStudents]) =>
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
    return this.store.pipe(
      select(BundleQueries.getOwn, { userId: this.authService.userId })
    );
  }

  private getLearningAreasWithBundleInfo(
    bundlesByLearningArea$: Observable<Dictionary<BundleInterface[]>>,
    booksByLearningArea$: Observable<Dictionary<ContentInterface[]>>
  ): Observable<LearningAreaWithBundleInstanceInfo> {
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
        ]): LearningAreaWithBundleInstanceInfo => {
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
        // learningAreas
        //   .map(
        //     (learningArea): LearningAreaWithBundleInstanceInfo => ({
        //       learning
        //       learningArea: learningArea,
        //       bundleCount: bundlesByLearningArea[learningArea.id]
        //         ? bundlesByLearningArea[learningArea.id].length
        //         : 0,
        //       bookCount: booksByLearningArea[learningArea.id]
        //         ? booksByLearningArea[learningArea.id].length
        //         : 0
        //     })
        //   )
        //   .filter(
        //     learningArea =>
        //       learningArea.bundleCount > 0 || learningArea.bookCount > 0
        //   )
      )
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
