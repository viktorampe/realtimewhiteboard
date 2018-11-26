import { Injectable } from '@angular/core';
import {
  EduContentFixture,
  EduContentInterface,
  LearningAreaFixture,
  LearningAreaInterface,
  UnlockedBoekeGroup,
  UnlockedBoekeGroupFixture,
  UnlockedBoekeStudent,
  UnlockedBoekeStudentFixture
} from '@campus/dal';
import { BehaviorSubject, Observable } from 'rxjs';

export class MockActivatedRoute {
  params: Observable<any> = new BehaviorSubject<any>({
    params: { bundle: 1, area: 1 }
  });
}

@Injectable({
  providedIn: 'root'
})
export class MockBooksViewModel {
  // source
  learningAreas$: Observable<LearningAreaInterface[]> = new BehaviorSubject([
    new LearningAreaFixture({ id: 1, name: 'foo' }),
    new LearningAreaFixture({ id: 2, name: 'foo' }),
    new LearningAreaFixture({ id: 3, name: 'foo' }),
    new LearningAreaFixture({ id: 4, name: 'foo' })
  ]);

  // TODO change to <EduContent[]> when tasks branch is merged
  eduContents$: Observable<EduContentInterface[]> = new BehaviorSubject([
    new EduContentFixture({ id: 1 }, { id: 1, title: 'foo' }),
    new EduContentFixture({ id: 2 }, { id: 2, title: 'foo' }),
    new EduContentFixture({ id: 3 }, { id: 3, title: 'foo' }),
    new EduContentFixture({ id: 4 }, { id: 4, title: 'foo' }),
    new EduContentFixture({ id: 5 }, { id: 5, title: 'foo' }),
    new EduContentFixture({ id: 6 }, { id: 6, title: 'foo' }),
    new EduContentFixture({ id: 6 }, { id: 7, title: 'foo' }),
    new EduContentFixture({ id: 7 }, { id: 8, title: 'foo' })
  ]);

  unlockedBoekeGroups$: Observable<UnlockedBoekeGroup[]> = new BehaviorSubject([
    new UnlockedBoekeGroupFixture({ id: 1, eduContentId: 1 }),
    new UnlockedBoekeGroupFixture({ id: 2, eduContentId: 2 }),
    new UnlockedBoekeGroupFixture({ id: 3, eduContentId: 3 }),
    new UnlockedBoekeGroupFixture({ id: 4, eduContentId: 4 })
  ]);

  unlockedBoekeStudents$: Observable<
    UnlockedBoekeStudent[]
  > = new BehaviorSubject([
    new UnlockedBoekeStudentFixture({ id: 1, eduContentId: 5 }),
    new UnlockedBoekeStudentFixture({ id: 2, eduContentId: 6 }),
    new UnlockedBoekeStudentFixture({ id: 3, eduContentId: 7 }),
    new UnlockedBoekeStudentFixture({ id: 4, eduContentId: 8 })
  ]);

  // presentation
  // TODO change to <EduContent[]> when tasks branch is merged
  sharedBooks$: Observable<EduContentInterface[]> = new BehaviorSubject([
    new EduContentFixture({ id: 1, publishedEduContentMetadataId: 1 }),
    new EduContentFixture({ id: 2, publishedEduContentMetadataId: 2 }),
    new EduContentFixture({ id: 3, publishedEduContentMetadataId: 3 }),
    new EduContentFixture({ id: 4, publishedEduContentMetadataId: 4 }),
    new EduContentFixture({ id: 5, publishedEduContentMetadataId: 5 }),
    new EduContentFixture({ id: 6, publishedEduContentMetadataId: 6 }),
    new EduContentFixture({ id: 7, publishedEduContentMetadataId: 7 }),
    new EduContentFixture({ id: 8, publishedEduContentMetadataId: 8 })
  ]);
}
