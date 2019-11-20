import { TestBed } from '@angular/core/testing';
import {
  EduContentBookFixture,
  EduContentBookInterface,
  LearningAreaFixture,
  LearningAreaInterface,
  MethodFixture,
  MethodInterface,
  YearFixture,
  YearInterface
} from '@campus/dal';
import { configureTestSuite } from 'ng-bullet';
import { getUnlockedBooks } from './practice.viewmodel.selectors';

describe('PracticeViewModel selectors', () => {
  configureTestSuite(() => {
    TestBed.configureTestingModule({});
  });

  describe('getUnlockedBooks', () => {
    const projector: Function = getUnlockedBooks.projector;

    const years: YearInterface[] = [
      new YearFixture({ id: 1, label: '1' }),
      new YearFixture({ id: 2, label: '2' })
    ];

    const books: EduContentBookInterface[] = [
      new EduContentBookFixture({
        id: 3,
        title: 'Katapult',
        methodId: 100,
        years: [years[0]]
      }),
      new EduContentBookFixture({
        id: 4,
        title: 'Kameleon',
        methodId: 200,
        years: [years[1]]
      }),
      new EduContentBookFixture({
        id: 5,
        title: 'Katapult',
        methodId: 100,
        years
      })
    ];

    const learningAreaDict: { [id: number]: LearningAreaInterface } = {
      10: new LearningAreaFixture({ id: 10, name: 'Rekenen' }),
      20: new LearningAreaFixture({ id: 20, name: 'Spelling' })
    };

    const methodDict: { [id: number]: MethodInterface } = {
      100: new MethodFixture({
        id: 100,
        learningAreaId: 10,
        code: 'foo'
      }),
      200: new MethodFixture({
        id: 200,
        learningAreaId: 20,
        code: 'bar'
      })
    };

    it('should return unlockedBooks', () => {
      const result = projector(books, learningAreaDict, methodDict);

      expect(result).toEqual([
        {
          bookId: 3,
          logoUrl: 'assets/methods/foo.jpg',
          learningAreaName: 'Rekenen',
          name: 'Katapult - 1'
        },
        {
          bookId: 4,
          logoUrl: 'assets/methods/bar.jpg',
          learningAreaName: 'Spelling',
          name: 'Kameleon - 2'
        },
        {
          bookId: 5,
          logoUrl: 'assets/methods/foo.jpg',
          learningAreaName: 'Rekenen',
          name: 'Katapult - 1,2'
        }
      ]);
    });
  });
});
