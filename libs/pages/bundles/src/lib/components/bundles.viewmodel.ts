import { Injectable } from '@angular/core';
import { ActivatedRoute, Resolve } from '@angular/router';
import {
  BundleInterface,
  BundleQueries,
  ContentInterface,
  EduContentMetadataInterface,
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
  UnlockedContentQueries
} from '@campus/dal';
import { ListFormat } from '@campus/ui';
import { select, Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { filter, map, shareReplay, switchMap, take } from 'rxjs/operators';

// TODO replace with actual DalState
export class DalState {}

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
  unlockedBookGroups$: Observable<UnlockedBoekeGroupInterface[]>;
  unlockedBookStudents$: Observable<UnlockedBoekeStudentInterface[]>;
  coupledPersons$: Observable<PersonInterface[]>;

  // intermediate streams (maps)
  bundlesByLearningArea$: Observable<{
    [key: number]: BundleInterface[];
  }>;
  unlockedContentByBundle$: Observable<{
    [key: number]: UnlockedContentInterface[];
  }>;

  // presentation streams
  // shared
  // > bundles
  activeBundle$: Observable<BundleInterface>;
  private sharedBundles$: Observable<BundleInterface[]>;
  sharedBundlesByLearningArea$: Observable<{
    [key: number]: BundleInterface[];
  }>;
  bundleContentsCount$: Observable<{
    [key: number]: number;
  }>;
  bundleContents$: Observable<ContentInterface[]>;
  // > books
  private sharedBooks$: Observable<EduContentMetadataInterface[]>;
  sharedBooksByLearningArea$: Observable<{
    [key: number]: EduContentMetadataInterface[];
  }>;
  // > learningAreas
  activeLearningArea$: Observable<LearningAreaInterface>;
  sharedLearningAreas$: Observable<LearningAreaInterface[]>;
  sharedLearningAreasCount$: Observable<{
    [key: number]: {
      bundlesCount: number;
      booksCount: number;
    };
  }>;
  sharedLearningAreaBundles$: Observable<BundleInterface[]>;
  sharedLearningAreaBooks$: Observable<EduContentMetadataInterface[]>;

  // own (TODO teacher)
  // > bundles
  private ownBundles$: Observable<BundleInterface[]>;
  // > books
  private ownBooks$: Observable<EduContentMetadataInterface[]>;
  // > learningAreas
  learningAreasWithOwnBundles$: Observable<LearningAreaInterface[]>;

  constructor(private route: ActivatedRoute, private store: Store<DalState>) {}

  resolve(): Observable<boolean> {
    this.learningAreaId$ = this.route.params.pipe(
      map((params): number => params.area || 0)
    );
    this.bundleId$ = this.route.params.pipe(
      map((params): number => params.bundle || 0)
    );

    // mock data from store
    // TODO get user from store
    this.user$ = new BehaviorSubject({
      id: 1,
      name: 'foo',
      firstName: 'bar',
      email: '',
      avatar: null
    });
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
    this.unlockedBookGroups$ = this.store.pipe(
      select(UnlockedBoekeGroupQueries.getAll)
    );
    this.unlockedBookStudents$ = this.store.pipe(
      select(UnlockedBoekeStudentQueries.getAll)
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
    this.sharedBooks$ = this.getSharedBooks(
      this.unlockedBookStudents$,
      this.unlockedBookGroups$
    );
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

    // TODO update with StateResolverInterface
    return new BehaviorSubject<boolean>(true).pipe(take(1));
  }

  changeListFormat(listFormat: ListFormat): void {
    this.store.dispatch(new UiActions.SetListFormatUi({ listFormat }));
  }

  /**
   * Get bundles for specified learning area
   *
   * @param {Observable<number>} learningAreaId$
   * @param {Observable<{
   *       [key: number]: BundleInterface[];
   *     }>} bundlesByLearningArea$
   * @returns {Observable<BundleInterface[]>}
   * @memberof BundlesViewModel
   */
  private getLearningAreaBundles(
    learningAreaId$: Observable<number>,
    bundlesByLearningArea$: Observable<{
      [key: number]: BundleInterface[];
    }>
  ): Observable<BundleInterface[]> {
    return combineLatest(learningAreaId$, bundlesByLearningArea$).pipe(
      map(
        ([learningAreaId, bundlesByLearningArea]) =>
          bundlesByLearningArea[learningAreaId]
      ),
      filter(bundles => !!bundles) // check if bundle exists in learningArea
    );
  }

  /**
   * Get books for specified learning area
   *
   * @param {Observable<number>} learningAreaId$
   * @param {Observable<{
   *       [key: number]: EduContentMetadataInterface[];
   *     }>} booksByLearningArea$
   * @returns {Observable<EduContentMetadataInterface[]>}
   * @memberof BundlesViewModel
   */
  private getLearningAreaBooks(
    learningAreaId$: Observable<number>,
    booksByLearningArea$: Observable<{
      [key: number]: EduContentMetadataInterface[];
    }>
  ): Observable<EduContentMetadataInterface[]> {
    return combineLatest(learningAreaId$, booksByLearningArea$).pipe(
      map(
        ([learningAreaId, booksByLearningArea]) =>
          booksByLearningArea[learningAreaId]
      ),
      filter(books => !!books) // check if bundle exists in learningArea
    );
  }

  /**
   * Return contents for bundle
   *
   * @param {Observable<number>} bundleId$
   * @param {Observable<{
   *       [key: number]: UnlockedContentInterface[];
   *     }>} unlockedContentByBundle$
   * @returns {Observable<ContentInterface[]>}
   * @memberof BundlesViewModel
   */
  private getBundleContents(
    bundleId$: Observable<number>,
    unlockedContentByBundle$: Observable<{
      [key: number]: UnlockedContentInterface[];
    }>
  ): Observable<ContentInterface[]> {
    return combineLatest(bundleId$, unlockedContentByBundle$).pipe(
      map(([bundleId, unlockedContentsMap]) => unlockedContentsMap[bundleId]),
      filter(unlockedContents => !!unlockedContents), // check if bundle exists
      map(unlockedContents =>
        unlockedContents.sort((a, b) => a.index - b.index).map(
          (unlockedContent): ContentInterface => {
            // TODO move to service
            if (unlockedContent.eduContentId) {
              const content =
                unlockedContent.eduContent.publishedEduContentMetadata;
              return {
                id: content.id,
                name: content.title,
                description: content.description,
                productType: unlockedContent.eduContent.type,
                fileExtension: content.fileExt,
                previewImage: content.thumbSmall
              };
            }
            if (unlockedContent.userContentId) {
              const content = unlockedContent.userContent;
              return {
                id: content.id,
                name: content.name,
                description: content.description,
                productType: content.type,
                fileExtension: content.fileExt,
                previewImage: null
              };
            }
          }
        )
      ),
      shareReplay(1)
    );
  }

  /**
   * Get only bundles that are shared with me, not my own
   * TODO get through selector?
   *
   * @private
   * @returns {Observable<BundleInterface[]>}
   * @memberof BundlesViewModel
   */
  private getSharedBundles(): Observable<BundleInterface[]> {
    return this.user$.pipe(
      switchMap(user =>
        this.store.pipe(select(BundleQueries.getShared, { userId: user.id }))
      )
    );
  }

  /**
   * Get book educontent that is shared with me
   *
   * @private
   * @param {Observable<UnlockedBoekeStudentInterface[]>} unlockedBookStudents$
   * @param {Observable<UnlockedBoekeGroupInterface[]>} unlockedBookGroups$
   * @returns {Observable<EduContentMetadataInterface[]>}
   * @memberof BundlesViewModel
   */
  private getSharedBooks(
    unlockedBookStudents$: Observable<UnlockedBoekeStudentInterface[]>,
    unlockedBookGroups$: Observable<UnlockedBoekeGroupInterface[]>
  ): Observable<EduContentMetadataInterface[]> {
    return combineLatest(
      this.user$,
      unlockedBookGroups$,
      unlockedBookStudents$
    ).pipe(
      map(
        ([user, unlockedBookGroups, unlockedBookStudents]): number[] => {
          // get array of unlocked book IDs
          return [
            ...unlockedBookGroups
              .filter(g => g.teacherId !== user.id)
              .map(g => g.eduContentId),
            ...unlockedBookStudents
              .filter(s => s.teacherId !== user.id)
              .map(s => s.eduContentId)
          ];
        }
      ),
      switchMap(eduContentIds =>
        this.store.pipe(
          select(EduContentQueries.getByIds, { ids: eduContentIds })
        )
      ),
      map(
        (eduContents): EduContentMetadataInterface[] =>
          eduContents.map(eduContent => eduContent.publishedEduContentMetadata)
      ),
      shareReplay(1)
    );
  }

  /**
   * Count number of unlockedContent per bundle
   *
   * @private
   * @param {Observable<{
   *     [key: number]: UnlockedContentInterface[];
   *   }>} unlockedContentByBundle$
   * @returns {Observable<{ [key: number]: number }>}
   * @memberof BundlesViewModel
   */
  private getBundleContentsCount(
    unlockedContentByBundle$: Observable<{
      [key: number]: UnlockedContentInterface[];
    }>
  ): Observable<{ [key: number]: number }> {
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

  /**
   * Get only bundles that I own, not shared with me
   * TODO get through selector?
   *
   * @private
   * @param {Observable<BundleInterface[]>} bundles$
   * @returns {Observable<BundleInterface[]>}
   * @memberof BundlesViewModel
   */
  private getOwnBundles(): Observable<BundleInterface[]> {
    return this.user$.pipe(
      switchMap(user =>
        this.store.pipe(select(BundleQueries.getOwn, { userId: user.id }))
      )
    );
  }

  /**
   * Get learning areas with shared bundels or books
   *
   * @private
   * @param {Observable<BundleInterface[]>} bundles$
   * @param {Observable<EduContentMetadataInterface[]>} books$
   * @returns {Observable<LearningAreaInterface[]>}
   * @memberof BundlesViewModel
   */
  private getLearningAreasWithContent(
    bundles$: Observable<BundleInterface[]>,
    books$: Observable<EduContentMetadataInterface[]>
  ): Observable<LearningAreaInterface[]> {
    return combineLatest(bundles$, books$).pipe(
      switchMap(
        ([bundles, books]): Observable<LearningAreaInterface[]> => {
          const learningAreaIds = [
            ...bundles.map(bundle => bundle.learningAreaId),
            ...books.map(book => book.learningAreaId)
          ];
          return this.store.pipe(
            select(LearningAreaQueries.getByIds, { ids: learningAreaIds })
          );
        }
      ),
      shareReplay(1)
    );
  }

  /**
   * Get count of bundles and books by learning area
   *
   * @private
   * @param {Observable<LearningAreaInterface[]>} learningAreas$
   * @param {Observable<{
   *       [key: number]: BundleInterface[];
   *     }>} sharedBundlesByLearningArea$
   * @param {Observable<{
   *       [key: number]: EduContentMetadataInterface[];
   *     }>} sharedBooksByLearningArea$
   * @returns {Observable<{
   *     [key: number]: {
   *       bundlesCount: number;
   *       booksCount: number;
   *     };
   *   }>}
   * @memberof BundlesViewModel
   */
  private getSharedLearningAreasCount(
    learningAreas$: Observable<LearningAreaInterface[]>,
    sharedBundlesByLearningArea$: Observable<{
      [key: number]: BundleInterface[];
    }>,
    sharedBooksByLearningArea$: Observable<{
      [key: number]: EduContentMetadataInterface[];
    }>
  ): Observable<{
    [key: number]: {
      bundlesCount: number;
      booksCount: number;
    };
  }> {
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

  /**
   * Map an array from a stream to an object mapped by specified ID
   *
   * @private
   * @param {Observable<any[]>} stream$
   * @param {string} key
   * @returns
   * @memberof BundlesViewModel
   */
  private groupStreamByKey(stream$: Observable<any[]>, key: string) {
    return stream$.pipe(
      map(
        (arr: any[]): { [key: number]: any[] } => {
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
