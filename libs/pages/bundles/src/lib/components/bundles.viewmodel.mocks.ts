import {
  BundleFixture,
  BundleInterface,
  ContentFixture,
  ContentInterface,
  LearningAreaFixture,
  LearningAreaInterface,
  PersonFixture,
  PersonInterface
} from '@campus/dal';
import { ListFormat } from '@campus/ui';
import { BehaviorSubject, Observable, of } from 'rxjs';
import {
  BundlesWithContentInfoInterface,
  LearningAreasWithBundlesInfoInterface
} from './bundles.viewmodel.interfaces';

export class MockActivatedRoute {
  params: Observable<any> = new BehaviorSubject<any>({
    params: { bundle: 1, area: 1 }
  });
}

export class MockViewModel {
  listFormat$: Observable<ListFormat> = new BehaviorSubject<ListFormat>(
    ListFormat.GRID
  );

  sharedLearningAreas$: Observable<
    LearningAreasWithBundlesInfoInterface
  > = new BehaviorSubject<LearningAreasWithBundlesInfoInterface>({
    learningAreas: [
      {
        learningArea: new LearningAreaFixture({ name: 'Foo' }),
        bundleCount: 0,
        bookCount: 0
      },
      {
        learningArea: new LearningAreaFixture({ name: 'Foo bar' }),
        bundleCount: 0,
        bookCount: 0
      },
      {
        learningArea: new LearningAreaFixture({ name: 'Bar' }),
        bundleCount: 0,
        bookCount: 0
      },
      {
        learningArea: new LearningAreaFixture({ name: 'Bar foo' }),
        bundleCount: 0,
        bookCount: 0
      }
    ]
  });

  changeListFormat() {}

  openContent(o:ContentInterface) {}

  getLearningAreaById(areaId: number): Observable<LearningAreaInterface> {
    return of(new LearningAreaFixture());
  }

  getSharedBundlesWithContentInfo(
    learningAreaId: number
  ): Observable<BundlesWithContentInfoInterface> {
    return of({
      bundles: [
        {
          bundle: new BundleFixture({ name: 'Foo' }),
          contentsCount: 4
        },
        {
          bundle: new BundleFixture({ name: 'Foo bar' }),
          contentsCount: 0
        },
        {
          bundle: new BundleFixture({ name: 'Bar' }),
          contentsCount: 0
        },
        {
          bundle: new BundleFixture({ name: 'Bar foo' }),
          contentsCount: 0
        }
      ],
      books: [new ContentFixture({ id: 1 })]
    });
  }

  getBundleById(bundleId: number): Observable<BundleInterface> {
    return of(new BundleFixture());
  }

  getBundleOwner(
    bundle$: Observable<BundleInterface>
  ): Observable<PersonInterface> {
    return of(new PersonFixture());
  }

  getBundleContents(bundleId: number): Observable<ContentInterface[]> {
    return of([
      new ContentFixture({ name: 'Foo' }),
      new ContentFixture({ name: 'Foo bar' }),
      new ContentFixture({ name: 'Bar' }),
      new ContentFixture({ name: 'Bar foo' })
    ]);
  }
}
