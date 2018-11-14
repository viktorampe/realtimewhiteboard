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
        learningArea: {
          id: 1,
          name: 'foo',
          color: '#fff'
        },
        bundleCount: 0,
        bookCount: 0
      }
    ]
  });

  changeListFormat() {}

  getLearningAreaById(areaId: number): Observable<LearningAreaInterface> {
    return of(new LearningAreaFixture());
  }

  getSharedBundlesWithContentInfo(
    learningAreaId: number
  ): Observable<BundlesWithContentInfoInterface> {
    return of({
      bundles: [],
      books: []
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
    return of([new ContentFixture()]);
  }
}
