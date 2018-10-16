import { Injectable } from '@angular/core';
import { ActivatedRoute, Resolve } from '@angular/router';
import {
  BundleInterface,
  BundleQueries,
  ContentInterface,
  EduContentInterface,
  EduContentMetadataInterface,
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

export class DalState {}

// TODO import real services
// mock services
export class LearningAreaService {
  getAll(): Observable<LearningAreaInterface[]> {
    return of([]);
  }
  getByIds(ids: number[]): Observable<LearningAreaInterface[]> {
    return of([]);
  }
}
export class BundleService {
  getAll(): Observable<BundleInterface[]> {
    return of([]);
  }
  getById(ids: number): Observable<BundleInterface> {
    return of();
  }
}
export class UnlockedContentService {
  getAll(): Observable<UnlockedContentInterface[]> {
    return of([]);
  }
}
export class EduContentService {
  getByIds(ids: number[]): Observable<EduContentInterface[]> {
    return of([]);
  }
}

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
  private sharedBundles$: Observable<BundleInterface[]>;
  sharedBundlesByLearningArea$: Observable<{
    [key: number]: EduContentMetadataInterface[];
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
  sharedLearningAreas$: Observable<LearningAreaInterface[]>;
  sharedLearningAreasCount$: Observable<{
    [key: number]: {
      bundlesCount: number;
      booksCount: number;
    };
  }>;

  // own (TODO teacher)
  // > bundles
  private ownBundles$: Observable<BundleInterface[]>;
  // > books
  private ownBooks$: Observable<EduContentMetadataInterface[]>;
  // > learningAreas
  learningAreasWithOwnBundles$: Observable<LearningAreaInterface[]>;

  constructor(
    private route: ActivatedRoute,
    private store: Store<DalState>,
    // TODO replace services with store selectors
    private learningAreaService: LearningAreaService,
    private eduContentService: EduContentService
  ) {}

  resolve(): Observable<boolean> {
    // mock data from store
    // TODO get user from store
    this.user$ = new BehaviorSubject({
      id: 1,
      email: ''
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

    // ** FROM HERE ** \\

    // presentation streams
    // shared
    // > bundles
    this.sharedBundles$ = this.getSharedBundles(this.bundles$);
    this.sharedBundlesByLearningArea$ = this.groupStreamByKey(
      this.sharedBundles$,
      'learningAreaId'
    );
    this.bundleContentsCount$ = this.getBundleContentsCount(
      this.unlockedContentByBundle$
    );
    this.bundleContents$ = this.getBundleContents(
      this.route.params.pipe(
        map(params => params.bundle),
        filter(bundleId => !!bundleId)
      ),
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
    this.sharedLearningAreas$ = this.getLearningAreasWithContent(
      this.sharedBundles$,
      this.sharedBooks$
    );
    this.sharedLearningAreasCount$ = this.getSharedLearningAreasCount(
      this.learningAreas$,
      this.bundlesByLearningArea$,
      this.sharedBooksByLearningArea$
    );

    // own (TODO teacher)
    // > bundles
    this.ownBundles$ = this.getOwnBundles(this.bundles$);
    // > books
    this.ownBooks$ = of([]); // TODO favorited books
    // > learningAreas
    this.learningAreasWithOwnBundles$ = this.getLearningAreasWithContent(
      this.ownBundles$,
      this.ownBooks$
    );

    return new BehaviorSubject<boolean>(true).pipe(take(1));
  }

  changeListFormat(listFormat: ListFormat): void {
    this.store.dispatch(new UiActions.SetListFormatUi({ listFormat }));
  }

  /**
   * Return contents for bundle
   *
   * @param {*} bundleId$
   * @param {*} unlockedContentByBundle$
   * @returns {Observable<ContentInterface[]>}
   * @memberof BundlesViewModel
   */
  getBundleContents(
    bundleId$,
    unlockedContentByBundle$
  ): Observable<ContentInterface[]> {
    return combineLatest(bundleId$, unlockedContentByBundle$).pipe(
      map(([bundleId, unlockedContentsMap]) => unlockedContentsMap[bundleId]),
      filter(unlockedContents => !!unlockedContents), // check if bundle exists
      map(unlockedContents =>
        unlockedContents.sort((a, b) => a.index - b.index).map(
          (unlockedContent): ContentInterface => {
            // TODO convert eduContent and userContent to uniform ContentInterface
            if (unlockedContent.eduContentId) {
              return unlockedContent.eduContent;
            }
            if (unlockedContent.userContentId) {
              return unlockedContent.userContent;
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
   * @param {Observable<BundleInterface[]>} bundles$
   * @returns {Observable<BundleInterface[]>}
   * @memberof BundlesViewModel
   */
  private getSharedBundles(
    bundles$: Observable<BundleInterface[]>
  ): Observable<BundleInterface[]> {
    return combineLatest(this.user$, bundles$).pipe(
      map(
        ([user, bundles]): BundleInterface[] =>
          bundles.filter(bundle => bundle.teacherId !== user.id)
      ),
      shareReplay(1)
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
      switchMap(this.eduContentService.getByIds),
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
  private getOwnBundles(
    bundles$: Observable<BundleInterface[]>
  ): Observable<BundleInterface[]> {
    return combineLatest(this.user$, bundles$).pipe(
      map(
        ([user, bundles]): BundleInterface[] =>
          bundles.filter(bundle => bundle.teacherId === user.id)
      ),
      shareReplay(1)
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
          return this.learningAreaService.getByIds(learningAreaIds);
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
   *     }>} bundlesByLearningArea$
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
    bundlesByLearningArea$: Observable<{
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
      bundlesByLearningArea$,
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
