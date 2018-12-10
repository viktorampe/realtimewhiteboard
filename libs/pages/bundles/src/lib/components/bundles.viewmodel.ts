import { Inject, Injectable } from '@angular/core';
import { AlertActions, AuthServiceInterface, AUTH_SERVICE_TOKEN, BundleInterface, BundleQueries, ContentInterface, DalState, EduContent, EduContentQueries, LearningAreaInterface, LearningAreaQueries, PersonFixture, PersonInterface, UiActions, UiQuery, UnlockedBoekeGroupQueries, UnlockedBoekeStudentQueries, UnlockedContentInterface, UnlockedContentQueries, UserContentQueries } from '@campus/dal';
import { ListFormat } from '@campus/ui';
import { Dictionary } from '@ngrx/entity';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable, of } from 'rxjs';
import { filter, map, shareReplay, switchMap } from 'rxjs/operators';
import { BundlesWithContentInfoInterface, LearningAreasWithBundlesInfoInterface } from './bundles.viewmodel.interfaces';

export type NestedPartial<T> = { [P in keyof T]?: NestedPartial<T[P]> };

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
  private sharedBooks$: Observable<EduContent[]>;
  private sharedBooksByLearningArea$: Observable<Dictionary<EduContent[]>>;
  // > bundles page
  private unlockedContentsByBundle$: Observable<
    Dictionary<UnlockedContentInterface[]>
  >;
  // > bundle detail page

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
    this.listFormat$ = this.store.pipe(select(UiQuery.getListFormat));
    this.learningAreas$ = this.store.pipe(select(LearningAreaQueries.getAll));

    // intermediate streams
    // > learningarea page
    this.sharedBundles$ = this.getSharedBundles();
    this.sharedBundlesByLearningArea$ = this.groupStreamByKey(
      this.sharedBundles$,
      { learningAreaId: 0 }
    );
    this.sharedBooks$ = this.getSharedBooks();
    this.sharedBooksByLearningArea$ = this.groupStreamByKey(this.sharedBooks$, {
      publishedEduContentMetadata: { learningAreaId: 0 }
    });
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

  public setBundleAlertRead(bundleId: number): void {
    this.store.dispatch(
      new AlertActions.SetAlertReadByFilter({
        personId: this.authService.userId,
        intended: false,
        filter: {
          bundleId: bundleId
        },
        read: true
      })
    );
  }
  
  changeListFormat(listFormat: ListFormat): void {
    this.store.dispatch(new UiActions.SetListFormat({ listFormat }));
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
          // TODO implement personqueries and enable test
          // this.store.pipe(select(PersonQueries.getById, { id: bundle.teacherId }))
          of(new PersonFixture({ id: bundle.teacherId }))
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
            ...unlockedContents.map(
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

  private getSharedBooks(): Observable<EduContent[]> {
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
          EduContent[]
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
      shareReplay(1)
    );
  }

  private getLearningAreasWithBundleInfo(
    bundlesByLearningArea$: Observable<Dictionary<BundleInterface[]>>,
    booksByLearningArea$: Observable<Dictionary<EduContent[]>>
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
    booksByLearningArea$: Observable<Dictionary<EduContent[]>>,
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
          Dictionary<EduContent[]>,
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
    key: NestedPartial<T>
  ): Observable<Dictionary<T[]>> {
    return stream$.pipe(
      map(
        (arr: T[]): Dictionary<T[]> => {
          const byKey = {};
          arr.forEach(item => {
            const prop = this.getPropertyByKey(item, key);
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

  private getPropertyByKey<T>(
    item: T,
    keys: NestedPartial<T>
  ): number | string {
    if (typeof item === 'string' || typeof item === 'number') {
      return item;
    }
    const key = Object.keys(keys)[0];
    return this.getPropertyByKey(item[key], keys[key]);
  }
}
