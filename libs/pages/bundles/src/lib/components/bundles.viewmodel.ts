import { Injectable } from '@angular/core';
import { ActivatedRoute, Resolve } from '@angular/router';
import {
  BundleInterface,
  EduContentInterface,
  EduContentMetadataInterface,
  LearningAreaInterface,
  PersonInterface,
  UnlockedBoekeGroupInterface,
  UnlockedBoekeStudentInterface,
  UnlockedContentInterface,
  UserContentInterface
} from '@campus/dal';
import { ListFormat } from '@campus/ui';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { filter, map, shareReplay, switchMap, take } from 'rxjs/operators';

/**
 * TODO: create interface for uniform ContentType
 */
export type ContentType = EduContentInterface | UserContentInterface;

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
  // source streams (mocked)
  // TODO get from store
  listFormat$ = new BehaviorSubject<ListFormat>(ListFormat.GRID);
  user$: Observable<PersonInterface> = new BehaviorSubject({
    id: 1,
    email: ''
  });
  learningAreas$: Observable<
    LearningAreaInterface[]
  > = this.learningAreaService.getAll();
  bundles$: Observable<BundleInterface[]> = this.bundleService.getAll();
  unlockedContents$: Observable<
    UnlockedContentInterface[]
  > = this.unlockedContentService.getAll();
  unlockedBookGroups$: Observable<
    UnlockedBoekeGroupInterface[]
  > = new BehaviorSubject([]);
  unlockedBookStudents$: Observable<
    UnlockedBoekeStudentInterface[]
  > = new BehaviorSubject([]);
  coupledPersons$: Observable<PersonInterface[]> = new BehaviorSubject([]);

  // intermediate streams
  // maps (TODO get through selector?)
  bundlesByLearningArea$: Observable<{
    [key: number]: BundleInterface[];
  }> = this.groupStreamByKey(this.bundles$, 'learningAreaId');
  unlockedContentByBundle$: Observable<{
    [key: number]: UnlockedContentInterface[];
  }> = this.groupStreamByKey(this.unlockedContents$, 'bundleId');

  // presentation streams
  // shared
  // > bundles
  private sharedBundles$: Observable<
    BundleInterface[]
  > = this.getSharedBundles();
  sharedBundlesByLearningArea$: Observable<{
    [key: number]: EduContentMetadataInterface[];
  }> = this.groupStreamByKey(this.sharedBundles$, 'learningAreaId');
  bundleContentsCount$: Observable<{
    [key: number]: number;
  }> = this.getBundleContentsCount();
  bundleContents$: Observable<ContentType[]> = this.getBundleContents();
  // > books
  private sharedBooks$: Observable<
    EduContentMetadataInterface[]
  > = this.getSharedBooks();
  sharedBooksByLearningArea$: Observable<{
    [key: number]: EduContentMetadataInterface[];
  }> = this.groupStreamByKey(this.sharedBooks$, 'learningAreaId');
  // > learningAreas
  sharedLearningAreas$: Observable<
    LearningAreaInterface[]
  > = this.getLearningAreasWithContent(this.sharedBundles$, this.sharedBooks$);
  sharedLearningAreasCount$: Observable<{
    [key: number]: {
      bundlesCount: number;
      booksCount: number;
    };
  }> = this.getSharedLearningAreasCount();

  // own (TODO teacher)
  // > bundles
  private ownBundles$: Observable<BundleInterface[]> = this.getOwnBundles();
  // > books
  private ownBooks$: Observable<EduContentMetadataInterface[]> = of([]); // TODO favorited books
  // > learningAreas
  learningAreasWithOwnBundles$: Observable<
    LearningAreaInterface[]
  > = this.getLearningAreasWithContent(this.ownBundles$, this.ownBooks$);

  constructor(
    private route: ActivatedRoute,
    // TODO replace mocked services with @Inject(token) ...
    private learningAreaService: LearningAreaService,
    private bundleService: BundleService,
    private unlockedContentService: UnlockedContentService,
    private eduContentService: EduContentService
  ) {}

  resolve(): Observable<boolean> {
    return new BehaviorSubject<boolean>(true).pipe(take(1));
  }

  changeListFormat(listFormat: ListFormat): void {
    this.listFormat$.next(listFormat);
  }

  /**
   * Return contents for bundle
   *
   * @returns {Observable<ContentType[]>}
   * @memberof BundlesViewModel
   */
  getBundleContents(): Observable<ContentType[]> {
    return combineLatest(this.route.params, this.unlockedContentByBundle$).pipe(
      map(([routeParams, unlockedContentsMap]) => {
        const bundleId = routeParams['bundle'];
        if (!bundleId) {
          return null;
        }
        return unlockedContentsMap[bundleId];
      }),
      filter(unlockedContents => !!unlockedContents), // check if bundle exists
      map(unlockedContents =>
        unlockedContents.sort((a, b) => a.index - b.index).map(
          (unlockedContent): ContentType => {
            // TODO convert eduContent and userContent to uniform ContentType
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
   * @returns {Observable<BundleInterface[]>}
   * @memberof BundlesViewModel
   */
  private getSharedBundles(): Observable<BundleInterface[]> {
    return combineLatest(this.user$, this.bundles$).pipe(
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
   * @returns {Observable<EduContentMetadataInterface[]>}
   * @memberof BundlesViewModel
   */
  private getSharedBooks(): Observable<EduContentMetadataInterface[]> {
    return combineLatest(
      this.user$,
      this.unlockedBookGroups$,
      this.unlockedBookStudents$
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
   * @returns {Observable<{[key: number]: number}>}
   * @memberof BundlesViewModel
   */
  private getBundleContentsCount(): Observable<{ [key: number]: number }> {
    return this.unlockedContentByBundle$.pipe(
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
   * @returns {Observable<BundleInterface[]>}
   * @memberof BundlesViewModel
   */
  private getOwnBundles(): Observable<BundleInterface[]> {
    return combineLatest(this.user$, this.bundles$).pipe(
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

  private getSharedLearningAreasCount(): Observable<{
    [key: number]: {
      bundlesCount: number;
      booksCount: number;
    };
  }> {
    return combineLatest(
      this.learningAreas$,
      this.bundlesByLearningArea$,
      this.sharedBooksByLearningArea$
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
