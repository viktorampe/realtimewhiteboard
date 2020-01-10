import {
  BundleFixture,
  BundleInterface,
  ContentFixture,
  ContentInterface,
  EduContentFixture,
  LearningAreaFixture,
  LearningAreaInterface,
  PersonFixture,
  PersonInterface,
  StudentContentStatusInterface,
  UnlockedContent,
  UnlockedContentFixture
} from '@campus/dal';
import { ViewModelInterface } from '@campus/testing';
import { ListFormat, SelectOption } from '@campus/ui';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { BundlesViewModel } from './bundles.viewmodel';
import {
  BundlesWithContentInfoInterface,
  LearningAreasWithBundlesInfoInterface
} from './bundles.viewmodel.interfaces';

export class MockActivatedRoute {
  params: Observable<any> = new BehaviorSubject<any>({
    params: { bundle: 1, area: 1 }
  });
}

export class MockViewModel implements ViewModelInterface<BundlesViewModel> {
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

  contentStatusOptions$: Observable<SelectOption[]> = new BehaviorSubject<
    SelectOption[]
  >([
    { value: 1, viewValue: 'foo' },
    { value: 2, viewValue: 'bar' }
  ]);

  currentUserHasWriteAccessToBundle(): boolean {
    return true;
  }

  changeListFormat() {}

  setBundleAlertRead() {}

  setBundleHistory() {}

  getStudentContentStatusByUnlockedContentId(): Observable<
    StudentContentStatusInterface
  > {
    return of({
      id: 1,
      personId: 1,
      unlockedContentId: 1,
      contentStatusId: 1
    });
  }

  saveContentStatus() {}

  openContent(o: UnlockedContent) {}

  openBook(o: ContentInterface) {}

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

  getBundleContents(bundleId: number): Observable<UnlockedContent[]> {
    return of([
      new UnlockedContentFixture({
        eduContent: new EduContentFixture({ id: 1 }, { title: 'Foo' }),
        eduContentId: 1
      }),
      new UnlockedContentFixture({
        eduContent: new EduContentFixture({ id: 1 }, { title: 'Foo bar' }),
        eduContentId: 1
      }),
      new UnlockedContentFixture({
        eduContent: new EduContentFixture({ id: 1 }, { title: 'Bar' }),
        eduContentId: 1
      }),
      new UnlockedContentFixture({
        eduContent: new EduContentFixture({ id: 1 }, { title: 'Bar foo' }),
        eduContentId: 1
      })
    ]);
  }

  getContentStatusOptions(): Observable<SelectOption[]> {
    return of([
      { value: 1, viewValue: 'foo' },
      { value: 2, viewValue: 'bar' }
    ]);
  }
}
