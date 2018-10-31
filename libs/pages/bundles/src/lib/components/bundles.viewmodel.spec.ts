import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import {
  AUTH_SERVICE_TOKEN,
  BundleInterface,
  EduContentInterface,
  EduContentMetadataInterface,
  LearningAreaInterface,
  UnlockedContentInterface
} from '@campus/dal';
import { Dictionary } from '@ngrx/entity';
import { Store, StoreModule } from '@ngrx/store';
import { hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';
import { marbles } from 'rxjs-marbles';
import { BundlesViewModel } from './bundles.viewmodel';
import { MockActivatedRoute } from './bundles.viewmodel.mocks';

describe('BundlesViewModel', () => {
  let bundlesViewModel: BundlesViewModel;

  function createLearningArea(id: number, name: string): LearningAreaInterface {
    return {
      id: id,
      name: name,
      color: 'color'
    };
  }

  function createBundle(id, learningAreaId): BundleInterface {
    return {
      id: id,
      learningAreaId: learningAreaId,
      name: 'foo',
      start: new Date(),
      end: new Date()
    };
  }
  function createBookMetaData(id, learningAreaId): EduContentMetadataInterface {
    return {
      id: id,
      learningAreaId: learningAreaId,
      title: 'foo',
      description: '',
      version: 1,
      metaVersion: '',
      language: 'nl',
      created: new Date()
    };
  }

  function createUnlockedContentInterface(
    index: number,
    id: number,
    bundleId: number
  ): UnlockedContentInterface {
    return {
      index: index,
      id: id,
      bundleId: bundleId
    };
  }

  const bundlesByLearningArea: Dictionary<BundleInterface[]> = {
    1: [createBundle(1, 1), createBundle(2, 1), createBundle(3, 1)],
    2: [createBundle(4, 2), createBundle(5, 2), createBundle(6, 2)],
    3: [createBundle(7, 3), createBundle(8, 3), createBundle(9, 3)]
  };
  const booksMetaDataByLearningArea: Dictionary<
    EduContentMetadataInterface[]
  > = {
    1: [
      createBookMetaData(1, 1),
      createBookMetaData(2, 1),
      createBookMetaData(3, 1)
    ],
    2: [
      createBookMetaData(4, 2),
      createBookMetaData(5, 2),
      createBookMetaData(6, 2)
    ],
    3: [
      createBookMetaData(7, 3),
      createBookMetaData(8, 3),
      createBookMetaData(9, 3)
    ]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({})],
      providers: [
        BundlesViewModel,
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        { provide: AUTH_SERVICE_TOKEN, useValue: {} },
        Store
      ]
    });
    bundlesViewModel = TestBed.get(BundlesViewModel);
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
          createUnlockedContentInterface(1, 1, 1),
          createUnlockedContentInterface(2, 2, 1),
          createUnlockedContentInterface(3, 3, 1)
        ],
        2: [
          createUnlockedContentInterface(10, 10, 2),
          createUnlockedContentInterface(20, 20, 2)
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
        createBundle(1, 1),
        createBundle(2, 1),
        createBundle(3, 1),
        createBundle(4, 2)
      ]
    });
    const books$: Observable<EduContentInterface[]> = hot('-a-|', {
      a: [
        { publishedEduContentMetadata: createBookMetaData(1, 1) },
        { publishedEduContentMetadata: createBookMetaData(2, 2) },
        { publishedEduContentMetadata: createBookMetaData(3, 3) }
      ]
    });
    expect(
      bundlesViewModel['getLearningAreaIdsWithContent'](bundles$, books$)
    ).toBeObservable(hot('-a-|', { a: [1, 2, 3] }));
  });

  it('getLearningAreasWithContent()', () => {
    const bundles$: Observable<BundleInterface[]> = hot('-a-|', {
      a: [
        createBundle(1, 1),
        createBundle(2, 1),
        createBundle(3, 1),
        createBundle(4, 2)
      ]
    });
    const books$: Observable<EduContentInterface[]> = hot('-a-|', {
      a: [
        { publishedEduContentMetadata: createBookMetaData(1, 1) },
        { publishedEduContentMetadata: createBookMetaData(2, 2) },
        { publishedEduContentMetadata: createBookMetaData(3, 3) }
      ]
    });
    const learningArea$ = hot('-a-|', { a: createLearningArea(1, 'name') });
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
      a: [createBundle(1, 2), createBundle(2, 3)]
    });
    bundlesViewModel.user$ = hot('a--|', { a: { id: 1 } });
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
