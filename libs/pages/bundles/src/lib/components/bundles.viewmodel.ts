import { Inject, Injectable } from '@angular/core';
import { ActivatedRoute, Params, Resolve } from '@angular/router';
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
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { filter, map, shareReplay, switchMap } from 'rxjs/operators';
import {
  BundlesWithContentInfo,
  LearningAreasWithBundlesInfo
} from './bundles.viewmodel.interfaces';

@Injectable({
  providedIn: 'root'
})
export class BundlesViewModel implements Resolve<boolean> {
  // source streams
  listFormat$: Observable<ListFormat>;
  user$: Observable<PersonInterface>;
  learningAreas$: Observable<LearningAreaInterface[]>;
  bundles$: Observable<BundleInterface[]>;
  unlockedContents$: Observable<UnlockedContentInterface[]>;
  sharedUnlockedBookGroups$: Observable<UnlockedBoekeGroupInterface[]>;
  sharedUnlockedBookStudents$: Observable<UnlockedBoekeStudentInterface[]>;
  coupledPersons$: Observable<PersonInterface[]>;

  private routeParams$: Observable<Params> = this.route.params;

  // intermediate streams (maps)
  // private bundlesByLearningArea$: Observable<Dictionary<BundleInterface[]>>;
  private unlockedContentsByBundle$: Observable<
    Dictionary<UnlockedContentInterface[]>
  >;
  // > learningareas page
  private sharedBundles$: Observable<BundleInterface[]>;
  private sharedBundlesByLearningArea$: Observable<
    Dictionary<BundleInterface[]>
  >;
  private sharedBooks$: Observable<EduContentInterface[]>;
  private sharedBooksByLearningArea$: Observable<
    Dictionary<ContentInterface[]>
  >;
  // > bundles page
  private learningAreaId$: Observable<number>;
  // > bundle detail page
  private bundleId$: Observable<number>;

  // presentation streams
  // > learningareas page
  sharedLearningAreas$: Observable<LearningAreasWithBundlesInfo>;
  // > bundles page
  activeLearningArea$: Observable<LearningAreaInterface>;
  activeLearningAreaBundles$: Observable<BundlesWithContentInfo>;
  // > bundle detail page
  activeBundle$: Observable<BundleInterface>;
  activeBundleOwner$: Observable<PersonInterface>;
  activeBundleContents$: Observable<ContentInterface[]>;

  constructor(
    private viewModelResolver: StateResolver,
    private store: Store<DalState>,
    private route: ActivatedRoute,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface
  ) {}

  resolve(): Observable<boolean> {
    console.log('resolving');
    this.learningAreaId$ = this.routeParams$.pipe(
      // TODO why params always empty?
      map((params): number => params.area || 19)
    );
    this.bundleId$ = this.routeParams$.pipe(
      map((params): number => params.bundle || 1)
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
    this.unlockedContentsByBundle$ = this.store.pipe(
      select(UnlockedContentQueries.getByBundleIds)
    );
    // > learningarea page
    this.sharedBundles$ = this.getSharedBundles();
    this.sharedBundlesByLearningArea$ = this.groupStreamByKey(
      this.sharedBundles$,
      'learningAreaId'
    );
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
    // > bundles page

    // presentation streams
    // > learningarea page
    this.sharedLearningAreas$ = this.getLearningAreasWithBundleInfo(
      this.sharedBundlesByLearningArea$,
      this.sharedBooksByLearningArea$
    );

    // > bundles page
    this.activeLearningArea$ = this.learningAreaId$.pipe(
      switchMap(
        (areaId: number): Observable<LearningAreaInterface> =>
          this.store.pipe(select(LearningAreaQueries.getById, { id: areaId }))
      )
    );
    this.activeLearningAreaBundles$ = this.getBundlesWithContentInfo(
      this.learningAreaId$,
      this.sharedBundlesByLearningArea$,
      this.sharedBooksByLearningArea$,
      this.unlockedContentsByBundle$
    );

    // > bundle detail page
    this.activeBundle$ = this.bundleId$.pipe(
      switchMap(
        (bundleId: number): Observable<BundleInterface> =>
          this.store.pipe(select(BundleQueries.getById, { id: bundleId }))
      )
    );
    this.activeBundleOwner$ = this.activeBundle$.pipe(
      switchMap(
        (bundle): Observable<PersonInterface> =>
          of({
            id: 1,
            firstName: 'foo',
            name: 'bar',
            displayName: 'foo bar',
            email: '',
            avatar: null
          })
        // TODO implement personqueries
        // this.store.pipe(select(PersonQueries.getById, { id: bundle.teacherId }))
      )
    );
    this.activeBundleContents$ = this.getBundleContents(
      this.bundleId$,
      this.unlockedContentsByBundle$
    );

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

  /**
   * TODO: move to service
   * Filter an array by specified key with partial value
   *
   * @param {any[]} list
   * @param {string} key
   * @param {string} value
   * @param {boolean} [ignoreCase=true]
   * @returns {any[]}
   * @memberof BundlesViewModel
   */
  public filterArray(
    list: any[],
    key: string,
    value: string,
    ignoreCase: boolean = true
  ): any[] {
    if (!value) {
      return list;
    }
    const keys: string[] = key.split('.');
    if (ignoreCase) {
      value = value.toLowerCase();
    }
    return list.filter(item => {
      let prop = keys.reduce((p: any, k: string) => {
        return p[k] || '';
      }, item);
      if (ignoreCase) {
        prop = prop.toLowerCase();
      }
      return prop.includes(value);
    });
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

  private getLearningAreasWithBundleInfo(
    bundlesByLearningArea$: Observable<Dictionary<BundleInterface[]>>,
    booksByLearningArea$: Observable<Dictionary<ContentInterface[]>>
  ): Observable<LearningAreasWithBundlesInfo> {
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
        ]): LearningAreasWithBundlesInfo => {
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

  private getBundlesWithContentInfo(
    learningAreaId$,
    bundlesByLearningArea$,
    booksByLearningArea$,
    unlockedContentsByBundle$
  ): Observable<BundlesWithContentInfo> {
    return combineLatest(
      learningAreaId$,
      bundlesByLearningArea$,
      booksByLearningArea$,
      unlockedContentsByBundle$
    ).pipe(
      map(
        ([
          learningAreaId,
          bundlesByArea,
          booksByArea,
          unlockedContentsByBundle
        ]: [
          number,
          Dictionary<BundleInterface[]>,
          Dictionary<ContentInterface[]>,
          Dictionary<UnlockedContentInterface[]>
        ]): BundlesWithContentInfo => {
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
