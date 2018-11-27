import { Injectable } from '@angular/core';
import {
  EduContent,
  EduContentFixture,
  LearningAreaFixture,
  LearningAreaInterface,
  MethodFixture,
  UnlockedBoekeGroup,
  UnlockedBoekeGroupFixture,
  UnlockedBoekeStudent,
  UnlockedBoekeStudentFixture
} from '@campus/dal';
import { ListFormat } from '@campus/ui';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
// TODO add: implements BooksViewModel
export class MockBooksViewModel {
  listFormat$: Observable<ListFormat> = new BehaviorSubject<ListFormat>(
    ListFormat.GRID
  );

  // source
  learningAreas$: Observable<LearningAreaInterface[]> = new BehaviorSubject([
    new LearningAreaFixture({ id: 1, name: 'foo' }),
    new LearningAreaFixture({ id: 2, name: 'foo' }),
    new LearningAreaFixture({ id: 3, name: 'foo' }),
    new LearningAreaFixture({ id: 4, name: 'foo' })
  ]);

  eduContents$: Observable<EduContent[]> = new BehaviorSubject([
    new EduContentFixture({ id: 1, publishedEduContentMetadataId: 1 }),
    new EduContentFixture({ id: 2, publishedEduContentMetadataId: 2 }),
    new EduContentFixture({ id: 3, publishedEduContentMetadataId: 3 }),
    new EduContentFixture({ id: 4, publishedEduContentMetadataId: 4 }),
    new EduContentFixture({ id: 5, publishedEduContentMetadataId: 5 }),
    new EduContentFixture({ id: 6, publishedEduContentMetadataId: 6 }),
    new EduContentFixture({ id: 7, publishedEduContentMetadataId: 7 }),
    new EduContentFixture({ id: 8, publishedEduContentMetadataId: 8 })
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
  sharedBooks$: Observable<EduContent[]> = new BehaviorSubject([
    new EduContentFixture(
      { id: 1, publishedEduContentMetadataId: 1 },
      {
        learningAreaId: 1,
        learningArea: new LearningAreaFixture({
          id: 1,
          icon: 'learning-area:wiskunde'
        }),
        fileName: 'blah.boek',
        title: 'bar',
        methods: [
          new MethodFixture({
            name: 'VBTL',
            icon: '/assets/images/vbtl.jpg'
          })
        ]
      }
    ),
    new EduContentFixture(
      { id: 2, publishedEduContentMetadataId: 2 },
      { learningAreaId: 1, learningArea: new LearningAreaFixture({ id: 1 }) }
    ),
    new EduContentFixture(
      { id: 3, publishedEduContentMetadataId: 3 },
      { learningAreaId: 2, learningArea: new LearningAreaFixture({ id: 2 }) }
    ),
    new EduContentFixture(
      { id: 4, publishedEduContentMetadataId: 4 },
      { learningAreaId: 2, learningArea: new LearningAreaFixture({ id: 2 }) }
    ),
    new EduContentFixture(
      { id: 5, publishedEduContentMetadataId: 5 },
      { learningAreaId: 3, learningArea: new LearningAreaFixture({ id: 3 }) }
    ),
    new EduContentFixture(
      { id: 6, publishedEduContentMetadataId: 6 },
      { learningAreaId: 3, learningArea: new LearningAreaFixture({ id: 3 }) }
    ),
    new EduContentFixture(
      { id: 7, publishedEduContentMetadataId: 7 },
      { learningAreaId: 4, learningArea: new LearningAreaFixture({ id: 4 }) }
    ),
    new EduContentFixture(
      { id: 8, publishedEduContentMetadataId: 8 },
      { learningAreaId: 4, learningArea: new LearningAreaFixture({ id: 4 }) }
    )
  ]);
}
