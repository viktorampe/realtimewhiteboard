import { TestBed } from '@angular/core/testing';
import {
  AUTH_SERVICE_TOKEN,
  BundleFixture,
  BundleInterface,
  EduContentInterface,
  EduContentMetadataFixture,
  EduContentMetadataInterface,
  LearningAreaFixture,
  UnlockedContentFixture,
  UnlockedContentInterface
} from '@campus/dal';
import { Dictionary } from '@ngrx/entity';
import { Store, StoreModule } from '@ngrx/store';
import { hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';
import { marbles } from 'rxjs-marbles';
import { BundlesViewModel } from './bundles.viewmodel';

describe('BundlesViewModel', () => {
  let storeState;

  let bundlesViewModel: BundlesViewModel;

  const bundlesByLearningArea: Dictionary<BundleInterface[]> = {
    1: [
      new BundleFixture({ id: 1, learningAreaId: 1 }),
      new BundleFixture({ id: 2, learningAreaId: 1 }),
      new BundleFixture({ id: 3, learningAreaId: 1 })
    ],
    2: [
      new BundleFixture({ id: 4, learningAreaId: 2 }),
      new BundleFixture({ id: 5, learningAreaId: 2 }),
      new BundleFixture({ id: 6, learningAreaId: 2 })
    ],
    3: [
      new BundleFixture({ id: 7, learningAreaId: 3 }),
      new BundleFixture({ id: 8, learningAreaId: 3 }),
      new BundleFixture({ id: 9, learningAreaId: 3 })
    ]
  };

  const booksMetaDataByLearningArea: Dictionary<
    EduContentMetadataInterface[]
  > = {
    1: [
      new EduContentMetadataFixture({ id: 1, learningAreaId: 1 }),
      new EduContentMetadataFixture({ id: 2, learningAreaId: 1 }),
      new EduContentMetadataFixture({ id: 3, learningAreaId: 1 })
    ],
    2: [
      new EduContentMetadataFixture({ id: 4, learningAreaId: 2 }),
      new EduContentMetadataFixture({ id: 5, learningAreaId: 2 }),
      new EduContentMetadataFixture({ id: 6, learningAreaId: 2 })
    ],
    3: [
      new EduContentMetadataFixture({ id: 7, learningAreaId: 3 }),
      new EduContentMetadataFixture({ id: 8, learningAreaId: 3 }),
      new EduContentMetadataFixture({ id: 9, learningAreaId: 3 })
    ]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({})],
      providers: [
        BundlesViewModel,
        Store,
        { provide: AUTH_SERVICE_TOKEN, useValue: {} }
      ]
    });
    bundlesViewModel = TestBed.get(BundlesViewModel);

    storeState = {
      bundles: {
        bundles: [], // TODO fill with new BundleFixture()
        loaded: true
      }
    };
  });

  it('should work', () => {
    expect(bundlesViewModel).toBeDefined();
  });

  it('getSharedBundles()', () => {
    return;
  });

  it(
    'getLearningAreaBundles()',
    marbles(m => {
      const learningAreaId$ = m.hot('--a--b|', {
        a: 1,
        b: 2
      });
      const bundlesByLearningArea$ = m.hot('-a----|', {
        a: bundlesByLearningArea
      });
      const result = '--a--b|';

      const result$: Observable<BundleInterface[]> = bundlesViewModel[
        'getLearningAreaBundles'
      ](learningAreaId$, bundlesByLearningArea$);
      m.expect(result$).toBeObservable(result, {
        a: bundlesByLearningArea[1],
        b: bundlesByLearningArea[2]
      });
    })
  );

  it(
    'getLearningAreaBooks()',
    marbles(m => {
      const learningAreaId$ = m.hot('--a--b|', {
        a: 1,
        b: 2
      });
      const booksByLearningArea$ = m.hot('--a---|', {
        a: booksMetaDataByLearningArea
      });
      const result = '--a--b|';

      const result$: Observable<
        EduContentMetadataInterface[]
      > = bundlesViewModel['getLearningAreaBooks'](
        learningAreaId$,
        booksByLearningArea$ //TODO typing needs to be fixed
      );
      m.expect(result$).toBeObservable(result, {
        a: booksMetaDataByLearningArea[1],
        b: booksMetaDataByLearningArea[2]
      });
    })
  );

  it('getBundleContentsCount()', () => {
    const unlockedContentByBundle$: Observable<
      Dictionary<UnlockedContentInterface[]>
    > = hot('a-|', {
      a: {
        1: [
          new UnlockedContentFixture({ index: 1, id: 1, bundleId: 1 }),
          new UnlockedContentFixture({ index: 2, id: 2, bundleId: 1 }),
          new UnlockedContentFixture({ index: 3, id: 3, bundleId: 1 })
        ],
        2: [
          new UnlockedContentFixture({ index: 10, id: 10, bundleId: 2 }),
          new UnlockedContentFixture({ index: 20, id: 20, bundleId: 2 })
        ]
      }
    });
    expect(
      bundlesViewModel['getBundleContentsCount'](unlockedContentByBundle$)
    ).toBeObservable(hot('a-|', { a: { 1: 3, 2: 2 } }));
  });

  // it('getBundleContents()', () => {
  //   return;
  // });

  // it('getSharedBooks()', () => {
  //   return;
  // });

  it('getLearningAreaIdsWithContent()', () => {
    const bundles$: Observable<BundleInterface[]> = hot('-a-|', {
      a: [
        new BundleFixture({ id: 1, learningAreaId: 1 }),
        new BundleFixture({ id: 2, learningAreaId: 1 }),
        new BundleFixture({ id: 3, learningAreaId: 1 }),
        new BundleFixture({ id: 4, learningAreaId: 2 })
      ]
    });
    const books$: Observable<EduContentInterface[]> = hot('-a-|', {
      a: [
        {
          publishedEduContentMetadata: new EduContentMetadataFixture({
            id: 1,
            learningAreaId: 1
          })
        },
        {
          publishedEduContentMetadata: new EduContentMetadataFixture({
            id: 2,
            learningAreaId: 2
          })
        },
        {
          publishedEduContentMetadata: new EduContentMetadataFixture({
            id: 3,
            learningAreaId: 3
          })
        }
      ]
    });
    expect(
      bundlesViewModel['getLearningAreaIdsWithContent'](bundles$, books$)
    ).toBeObservable(hot('-a-|', { a: [1, 2, 3] }));
  });

  it('getLearningAreasWithContent()', () => {
    const bundles$: Observable<BundleInterface[]> = hot('-a-|', {
      a: [
        new BundleFixture({ id: 1, learningAreaId: 1 }),
        new BundleFixture({ id: 2, learningAreaId: 1 }),
        new BundleFixture({ id: 3, learningAreaId: 1 }),
        new BundleFixture({ id: 4, learningAreaId: 2 })
      ]
    });
    const books$: Observable<EduContentInterface[]> = hot('-a-|', {
      a: [
        {
          publishedEduContentMetadata: new EduContentMetadataFixture({
            id: 1,
            learningAreaId: 1
          })
        },
        {
          publishedEduContentMetadata: new EduContentMetadataFixture({
            id: 2,
            learningAreaId: 2
          })
        },
        {
          publishedEduContentMetadata: new EduContentMetadataFixture({
            id: 3,
            learningAreaId: 3
          })
        }
      ]
    });
    const learningArea$ = hot('-a-|', { a: new LearningAreaFixture() });
    const spy = jest
      .spyOn(bundlesViewModel['store'], 'pipe')
      .mockReturnValue(learningArea$);
    expect(
      bundlesViewModel['getLearningAreasWithContent'](bundles$, books$)
    ).toBeObservable(learningArea$);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('getOwnBundles()', () => {
    const ownBundles$ = hot('-a-|', {
      a: [
        new BundleFixture({ id: 1, learningAreaId: 2 }),
        new BundleFixture({ id: 2, learningAreaId: 3 })
      ]
    });
    const spy = jest
      .spyOn(bundlesViewModel['store'], 'pipe')
      .mockReturnValue(ownBundles$);
    expect(bundlesViewModel['getOwnBundles']()).toBeObservable(ownBundles$);
    expect(spy).toHaveBeenCalled();
  });

  it('getSharedLearningAreasCount()', () => {
    return;
  });
});
