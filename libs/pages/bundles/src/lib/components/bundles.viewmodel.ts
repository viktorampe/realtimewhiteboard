import { Inject, Injectable } from '@angular/core';
import {
  AlertActions,
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  BundleInterface,
  BundleQueries,
  ContentInterface,
  ContentStatusLabel,
  ContentStatusQueries,
  createHistoryFromBundle,
  createHistoryFromContent,
  DalState,
  EduContent,
  EduContentQueries,
  HistoryActions,
  LearningAreaInterface,
  LearningAreaQueries,
  LinkedPersonQueries,
  Permissions,
  PersonInterface,
  StudentContentStatusActions,
  StudentContentStatusInterface,
  StudentContentStatusQueries,
  UiActions,
  UiQuery,
  UnlockedBoekeGroupQueries,
  UnlockedBoekeStudentQueries,
  UnlockedContent,
  UnlockedContentInterface,
  UnlockedContentQueries,
  UserContentQueries
} from '@campus/dal';
import {
  OpenStaticContentServiceInterface,
  OPEN_STATIC_CONTENT_SERVICE_TOKEN,
  PermissionServiceInterface,
  PERMISSION_SERVICE_TOKEN,
  ScormExerciseServiceInterface,
  SCORM_EXERCISE_SERVICE_TOKEN
} from '@campus/shared';
import { ListFormat, SelectOption } from '@campus/ui';
import { NestedPartial } from '@campus/utils';
import { Dictionary } from '@ngrx/entity';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import {
  filter,
  map,
  share,
  shareReplay,
  switchMap,
  switchMapTo,
  take
} from 'rxjs/operators';
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
  private sharedBooks$: Observable<EduContent[]>;
  private sharedBooksByLearningArea$: Observable<Dictionary<EduContent[]>>;
  // > bundles page
  private unlockedContentsByBundle$: Observable<
    Dictionary<UnlockedContentInterface[]>
  >;

  private hasManageHistoryPermission = this.permissionService
    .hasPermission(Permissions.settings.MANAGE_HISTORY)
    .pipe(
      take(1),
      filter(hasPermission => hasPermission),
      share()
    );
  // > bundle detail page

  // presentation streams
  // > learningareas page
  sharedLearningAreas$: Observable<LearningAreasWithBundlesInfoInterface>;
  // > bundle detail page
  contentStatusOptions$: Observable<SelectOption[]>;

  constructor(
    private store: Store<DalState>,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface,
    @Inject(OPEN_STATIC_CONTENT_SERVICE_TOKEN)
    private openStaticContentService: OpenStaticContentServiceInterface,
    @Inject(SCORM_EXERCISE_SERVICE_TOKEN)
    private scormExerciseService: ScormExerciseServiceInterface,
    @Inject(PERMISSION_SERVICE_TOKEN)
    private permissionService: PermissionServiceInterface
  ) {
    this.initialize();
  }

  private initialize(): void {
    // source streams
    this.listFormat$ = this.store.pipe(select(UiQuery.getListFormat));
    this.learningAreas$ = this.store.pipe(select(LearningAreaQueries.getAll));
    this.contentStatusOptions$ = this.getContentStatusOptions();

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
        read: true,
        customFeedbackHandlers: {
          useCustomErrorHandler: 'useNoHandler',
          useCustomSuccessHandler: 'useNoHandler'
        }
      })
    );
  }

  public currentUserHasWriteAccessToBundle(bundle: BundleInterface): boolean {
    // for now that's only when it's own bundle
    return bundle.teacherId === this.authService.userId;
  }

  changeListFormat(listFormat: ListFormat): void {
    this.store.dispatch(new UiActions.SetListFormat({ listFormat }));
  }

  openContent(unlockedContent: UnlockedContent): void {
    this.hasManageHistoryPermission.subscribe(() => {
      const history = createHistoryFromContent(unlockedContent.content);
      if (history) {
        this.store.dispatch(
          new HistoryActions.StartUpsertHistory({
            history
          })
        );
      }
    });

    if (unlockedContent.eduContentId) {
      if (unlockedContent.eduContent.type === 'exercise') {
        if (this.authService.userId === unlockedContent.teacherId) {
          //own bundle -> teacher -> dialog with or without answers
          return;
        } else {
          this.scormExerciseService.startExerciseFromUnlockedContent(
            this.authService.userId,
            unlockedContent.eduContentId,
            unlockedContent.id
          );

          return;
        }
      }
    }
    this.openStaticContentService.open(unlockedContent.content);
  }

  openBook(content: ContentInterface): void {
    this.openStaticContentService.open(content);

    this.hasManageHistoryPermission.subscribe(() => {
      const history = createHistoryFromContent(content);
      if (history) {
        this.store.dispatch(
          new HistoryActions.StartUpsertHistory({
            history
          })
        );
      }
    });
  }

  public getStudentContentStatusByUnlockedContentId(
    unlockedContentId: number
  ): Observable<StudentContentStatusInterface> {
    return this.store.pipe(
      select(StudentContentStatusQueries.getByUnlockedContentId, {
        unlockedContentId
      })
    );
  }

  public saveContentStatus(
    unlockedContentId: number,
    contentStatusId: number
  ): void {
    this.store.dispatch(
      new StudentContentStatusActions.UpsertStudentContentStatus({
        studentContentStatus: {
          personId: this.authService.userId,
          unlockedContentId,
          contentStatusId
        }
      })
    );
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
          this.store.pipe(
            select(LinkedPersonQueries.getById, { id: bundle.teacherId })
          )
      )
    );
  }

  getBundleContents(bundleId: number): Observable<UnlockedContent[]> {
    return combineLatest(
      this.store.pipe(
        select(UnlockedContentQueries.getByBundleId, { bundleId })
      ),
      this.store.pipe(select(EduContentQueries.getAllEntities)),
      this.store.pipe(select(UserContentQueries.getAllEntities))
    ).pipe(
      map(([unlockedContents, eduContentEnts, userContentEnts]) => {
        return unlockedContents.map(
          (unlockedContent): UnlockedContent => {
            return Object.assign(new UnlockedContent(), {
              ...unlockedContent,
              eduContent: unlockedContent.eduContentId
                ? eduContentEnts[unlockedContent.eduContentId]
                : undefined,
              userContent: unlockedContent.userContentId
                ? userContentEnts[unlockedContent.userContentId]
                : undefined
            });
          }
        );
      }),
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

  public setBundleHistory(bundleId: number): void {
    this.hasManageHistoryPermission
      .pipe(
        switchMapTo(
          this.store.pipe(
            select(BundleQueries.getById, { id: bundleId }),
            take(1)
          )
        )
      )
      .subscribe(bundle =>
        this.store.dispatch(
          new HistoryActions.StartUpsertHistory({
            history: createHistoryFromBundle(bundle)
          })
        )
      );
  }

  getContentStatusOptions(): Observable<SelectOption[]> {
    return this.store.pipe(
      select(ContentStatusQueries.getAll),
      map(contentStatuses => [
        { value: 0, viewValue: ContentStatusLabel.NEW }, // default status
        ...contentStatuses.map(
          (contentStatus): SelectOption => ({
            value: contentStatus.id,
            viewValue: ContentStatusLabel[contentStatus.label]
          })
        )
      ])
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
