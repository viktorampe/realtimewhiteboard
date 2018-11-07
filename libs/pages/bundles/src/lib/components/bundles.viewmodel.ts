import { Inject, Injectable } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
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
  UserContentQueries
} from '@campus/dal';
import { ListFormat } from '@campus/ui';
import { Dictionary } from '@ngrx/entity';
import { select, Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
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
  learningAreas$: Observable<LearningAreaInterface[]>;
  bundles$: Observable<BundleInterface[]>;
  unlockedContents$: Observable<UnlockedContentInterface[]>;
  sharedUnlockedBookGroups$: Observable<UnlockedBoekeGroupInterface[]>;
  sharedUnlockedBookStudents$: Observable<UnlockedBoekeStudentInterface[]>;
  coupledPersons$: Observable<PersonInterface[]>;

  private routeParams$: Observable<Params> = this.route.params;

  // intermediate streams (maps)
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
  private unlockedContentsByBundle$: Observable<
    Dictionary<UnlockedContentInterface[]>
  >;
  // > bundle detail page
  private bundleId$: Observable<number>;

  // presentation streams
  // > learningareas page
  sharedLearningAreas$: Observable<LearningAreasWithBundlesInfoInterface>;
  // > bundles page
  activeLearningArea$: Observable<LearningAreaInterface>;
  activeLearningAreaBundles$: Observable<BundlesWithContentInfoInterface>;
  // > bundle detail page
  activeBundle$: Observable<BundleInterface>;
  activeBundleOwner$: Observable<PersonInterface>;
  activeBundleContents$: Observable<ContentInterface[]>;
  // TODO: contentstatus

  constructor(
    private store: Store<DalState>,
    private route: ActivatedRoute,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface
  ) {
    this.initialize();
  }

  initialize(): void {
    this.learningAreaId$ = this.route.params.pipe(
      map((params): number => params.area || 19)
    );
    this.bundleId$ = this.routeParams$.pipe(
      map((params): number => params.bundle || 1)
    );

    // source streams
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
    // TODO add TeacherStudent state
    this.coupledPersons$ = new BehaviorSubject([]);

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

    // > bundles page
    this.activeLearningArea$ = this.getActiveLearningArea();
    this.activeLearningAreaBundles$ = this.getBundlesWithContentInfo(
      this.learningAreaId$,
      this.sharedBundlesByLearningArea$,
      this.sharedBooksByLearningArea$,
      this.unlockedContentsByBundle$
    );

    // > bundle detail page
    this.activeBundle$ = this.getActiveBundle();
    this.activeBundleOwner$ = this.getBundleOwner(this.activeBundle$);
    this.activeBundleContents$ = this.getBundleContents(
      this.bundleId$,
      this.unlockedContentsByBundle$
    );
  }

  changeListFormat(listFormat: ListFormat): void {
    this.store.dispatch(new UiActions.SetListFormatUi({ listFormat }));
  }

  private getActiveLearningArea(): Observable<LearningAreaInterface> {
    return this.learningAreaId$.pipe(
      switchMap(
        (areaId: number): Observable<LearningAreaInterface> =>
          this.store.pipe(select(LearningAreaQueries.getById, { id: areaId }))
      )
    );
  }

  private getActiveBundle(): Observable<BundleInterface> {
    return this.bundleId$.pipe(
      switchMap(
        (bundleId: number): Observable<BundleInterface> =>
          this.store.pipe(select(BundleQueries.getById, { id: bundleId }))
      )
    );
  }

  private getBundleOwner(
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
      map(
        (eduContents): EduContentInterface[] => {
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

  private getBundlesWithContentInfo(
    learningAreaId$: Observable<number>,
    bundlesByLearningArea$: Observable<Dictionary<BundleInterface[]>>,
    booksByLearningArea$: Observable<Dictionary<ContentInterface[]>>,
    unlockedContentsByBundle$: Observable<
      Dictionary<UnlockedContentInterface[]>
    >
  ): Observable<BundlesWithContentInfoInterface> {
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

  private groupStreamByKey(
    stream$: Observable<any[]>,
    key: string
  ): Observable<Dictionary<any[]>> {
    return stream$.pipe(
      map(
        (arr: any[]): Dictionary<any[]> => {
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
