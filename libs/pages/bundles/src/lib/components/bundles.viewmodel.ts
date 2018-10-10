import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import {
  BundleInterface,
  EduContentInterface,
  EduContentMetadataInterface,
  LearningAreaInterface,
  PersonInterface,
  UnlockedBoekeGroupInterface,
  UnlockedBoekeStudentInterface
} from '@campus/dal';
import { ListFormat } from '@campus/ui';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { map, shareReplay, switchMap, take } from 'rxjs/operators';

/**
 * Create interface for combined data
 *
 * @export
 * @interface LearningAreaBundles
 * @extends {LearningAreaInterface}
 */
export interface LearningAreaBundles extends LearningAreaInterface {
  bundles: BundleInterface[];
  books: EduContentMetadataInterface[];
}

// TODO import real services
// mock services
export class EduContentService {
  getByIds(ids: number[]): Observable<EduContentInterface[]> {
    return of([]);
  }
}

@Injectable({
  providedIn: 'root'
})
export class BundlesViewModel implements Resolve<boolean> {
  listFormat$ = new BehaviorSubject<ListFormat>(ListFormat.GRID);
  learningAreas$: Observable<LearningAreaInterface[]> = new BehaviorSubject<
    LearningAreaInterface[]
  >([
    {
      icon: 'polpo-wiskunde',
      id: 19,
      color: '#2c354f',
      name: 'Wiskunde'
    },
    {
      icon: 'polpo-aardrijkskunde',
      id: 1,
      color: '#485235',
      name: 'Aardrijkskunde'
    },
    {
      icon: 'polpo-frans',
      id: 2,
      color: '#385343',
      name: 'Frans'
    },
    {
      icon: 'polpo-godsdienst',
      id: 13,
      color: '#325235',
      name: 'Godsdienst, Didactische & Pedagogische ondersteuning'
    }
  ]);
  learningAreasCounts$: Observable<any> = new BehaviorSubject<any>({
    1: {
      booksCount: 1,
      bundlesCount: 2
    },
    2: {
      booksCount: 4,
      bundlesCount: 0
    },
    13: {
      booksCount: 0,
      bundlesCount: 0
    },
    19: {
      booksCount: 9,
      bundlesCount: 7
    }
  });

  // TODO get user$, learningAreas$, bundles$, unlockedBookGroups$, unlockedBookStudents$ from services
  // mock streams
  user$: Observable<PersonInterface> = new BehaviorSubject({
    id: 1,
    email: ''
  });
  bundles$: Observable<BundleInterface[]> = new BehaviorSubject([]);
  unlockedBookGroups$: Observable<
    UnlockedBoekeGroupInterface[]
  > = new BehaviorSubject([]);
  unlockedBookStudents$: Observable<
    UnlockedBoekeStudentInterface[]
  > = new BehaviorSubject([]);

  // Combined data
  private sharedBundles$: Observable<
    BundleInterface[]
  > = this.getSharedBundles();
  private sharedBooks$: Observable<
    EduContentMetadataInterface[]
  > = this.getSharedBooks();

  sharedLearningAreas$: Observable<
    LearningAreaBundles[]
  > = this.getLearningAreasWithContent(this.sharedBundles$, this.sharedBooks$);

  // own
  ownBundles$: Observable<BundleInterface[]> = this.getOwnBundles();
  ownBooks$: Observable<EduContentMetadataInterface[]> = of([]); // TODO favorited books
  learningAreasWithOwnBundles$: Observable<
    LearningAreaBundles[]
  > = this.getLearningAreasWithContent(this.ownBundles$, this.ownBooks$);

  // TODO replace mocked services with @Inject(token) ...
  constructor(private eduContentService: EduContentService) {}

  /**
   * Get only bundles that are shared with me, not my own
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
      this.unlockedBookGroups$,
      this.unlockedBookStudents$
    ).pipe(
      map(
        ([unlockedBookGroups, unlockedBookStudents]): number[] => {
          // get array of unlocked book IDs
          return [
            ...unlockedBookGroups.map(g => g.eduContentId),
            ...unlockedBookStudents.map(s => s.eduContentId)
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
   * Get only bundles that I own, not shared with me
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
   * @param {Observable<EduContentMetadataInterface[]>} books$
   * @returns {Observable<LearningAreaBundles[]>}
   * @memberof BundlesViewModel
   */
  private getLearningAreasWithContent(
    bundles$: Observable<BundleInterface[]>,
    books$: Observable<EduContentMetadataInterface[]>
  ): Observable<LearningAreaBundles[]> {
    return combineLatest(this.learningAreas$, bundles$, books$).pipe(
      map(
        ([learningAreas, bundles, books]): LearningAreaBundles[] =>
          this.filterSharedLearningAreas(learningAreas, bundles, books)
      ),
      shareReplay(1)
    );
  }

  /**
   * Add bundles to learning area, then filter learning areas without bundles
   *
   * @private
   * @param {LearningAreaInterface[]} learningAreas
   * @param {BundleInterface[]} bundles
   * @param {EduContentMetadataInterface[]} books
   * @returns {LearningAreaBundles[]}
   * @memberof BundlesViewModel
   */
  private filterSharedLearningAreas(
    learningAreas: LearningAreaInterface[],
    bundles: BundleInterface[],
    books: EduContentMetadataInterface[]
  ): LearningAreaBundles[] {
    const mapBundlesByArea: { [key: number]: BundleInterface[] } = {};
    bundles.forEach(bundle => {
      if (!mapBundlesByArea[bundle.learningAreaId]) {
        mapBundlesByArea[bundle.learningAreaId] = [];
      }
      mapBundlesByArea[bundle.learningAreaId].push(bundle);
    });

    const mapBooksByArea: { [key: number]: EduContentMetadataInterface[] } = {};
    books.forEach(book => {
      if (!mapBooksByArea[book.learningAreaId]) {
        mapBooksByArea[book.learningAreaId] = [];
      }
      mapBooksByArea[book.learningAreaId].push(book);
    });

    // remove learning areas where there are no bundles and no books
    return learningAreas
      .filter(
        learningArea =>
          !mapBundlesByArea[learningArea.id] && !mapBooksByArea[learningArea.id]
      )
      .map(
        learningArea =>
          <LearningAreaBundles>{
            ...learningArea,
            bundles: mapBundlesByArea[learningArea.id] || [],
            books: mapBooksByArea[learningArea.id] || []
          }
      );
  }

  resolve(): Observable<boolean> {
    return new BehaviorSubject<boolean>(true).pipe(take(1));
  }

  changeListFormat(listFormat: ListFormat): void {
    this.listFormat$.next(listFormat);
  }
}
