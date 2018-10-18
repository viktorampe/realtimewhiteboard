import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { BundleInterface, EduContentMetadataInterface } from '@campus/dal';
import { Store, StoreModule } from '@ngrx/store';
import { Observable } from 'rxjs';
import { marbles } from 'rxjs-marbles';
import { BundlesViewModel } from './bundles.viewmodel';

describe('BundlesViewModel', () => {
  let bundlesViewModel: BundlesViewModel;

  function bundle(id, learningAreaId): BundleInterface {
    return {
      id: id,
      learningAreaId: learningAreaId,
      name: 'foo',
      start: new Date(),
      end: new Date()
    };
  }
  function book(id, learningAreaId): EduContentMetadataInterface {
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

  const bundlesByLearningArea: { [key: number]: BundleInterface[] } = {
    1: [bundle(1, 1), bundle(2, 1), bundle(3, 1)],
    2: [bundle(4, 2), bundle(5, 2), bundle(6, 2)],
    3: [bundle(7, 3), bundle(8, 3), bundle(9, 3)]
  };
  const booksByLearningArea: {
    [key: number]: EduContentMetadataInterface[];
  } = {
    1: [book(1, 1), book(2, 1), book(3, 1)],
    2: [book(4, 2), book(5, 2), book(6, 2)],
    3: [book(7, 3), book(8, 3), book(9, 3)]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({})],
      providers: [
        BundlesViewModel,
        { provide: ActivatedRoute, useValue: {} },
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
        a: booksByLearningArea
      });
      const result = '--a--b|';

      const result$: Observable<
        EduContentMetadataInterface[]
      > = bundlesViewModel['getLearningAreaBooks'](
        learningAreaId$,
        booksByLearningArea$
      );
      m.expect(result$).toBeObservable(result, {
        a: booksByLearningArea[1],
        b: booksByLearningArea[2]
      });
    })
  );

  it('getBundleContentsCount()', () => {
    return;
  });

  it('getBundleContents()', () => {
    return;
  });

  it('getSharedBooks()', () => {
    return;
  });

  it('getLearningAreasWithContent()', () => {
    return;
  });

  it('getSharedLearningAreasCount()', () => {
    return;
  });

  it('getOwnBundles()', () => {
    return;
  });
});
