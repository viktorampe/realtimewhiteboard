import { TestBed } from '@angular/core/testing';
import {
  EduContentBookFixture,
  EduContentBookInterface,
  EduContentTOCEduContentFixture,
  EduContentTOCEduContentInterface,
  EduContentTOCFixture,
  EduContentTOCInterface,
  LearningAreaFixture,
  LearningAreaInterface,
  MethodFixture,
  MethodInterface,
  ResultFixture,
  ResultInterface,
  YearFixture,
  YearInterface
} from '@campus/dal';
import { configureTestSuite } from 'ng-bullet';
import {
  ChapterWithStatus,
  getChaptersWithStatuses,
  getUnlockedBooks
} from './practice.viewmodel.selectors';

describe('PracticeViewModel selectors', () => {
  configureTestSuite(() => {
    TestBed.configureTestingModule({});
  });

  describe('getChaptersWithStatuses', () => {
    const projector: Function = getChaptersWithStatuses.projector;

    const treeForBook = [
      new EduContentTOCFixture({
        id: 1,
        title: 'Chapter 1',
        children: [
          new EduContentTOCFixture({
            id: 2,
            title: 'Lesson 1'
          }),
          new EduContentTOCFixture({
            id: 3,
            title: 'Lesson 2'
          })
        ]
      }),
      new EduContentTOCFixture({
        id: 3,
        title: 'Chapter 2',
        children: [
          new EduContentTOCFixture({
            id: 4,
            title: 'Lesson 3'
          }),
          new EduContentTOCFixture({
            id: 5,
            title: 'Lesson 4'
          })
        ]
      })
    ];

    const eduContentTOCEduContent = [
      new EduContentTOCEduContentFixture({
        eduContentTOCId: 2,
        eduContentId: 100
      }),
      new EduContentTOCEduContentFixture({
        eduContentTOCId: 2,
        eduContentId: 101
      }),
      new EduContentTOCEduContentFixture({
        eduContentTOCId: 3,
        eduContentId: 102
      }),
      new EduContentTOCEduContentFixture({
        eduContentTOCId: 3,
        eduContentId: 103,
        type: 'boek-e'
      }),
      new EduContentTOCEduContentFixture({
        eduContentTOCId: 4,
        eduContentId: 104
      }),
      new EduContentTOCEduContentFixture({
        eduContentTOCId: 4,
        eduContentId: 105
      }),
      new EduContentTOCEduContentFixture({
        eduContentTOCId: 5,
        eduContentId: 106
      }),
      new EduContentTOCEduContentFixture({
        eduContentTOCId: 5,
        eduContentId: 107
      })
    ];

    const bestResultByEduContentId = {
      100: new ResultFixture({ score: 0 }),
      102: new ResultFixture({ score: 50 }),
      103: new ResultFixture({ score: 75 }),
      106: new ResultFixture({ score: 100 })
    };

    const testCases: {
      it: string;
      input: {
        treeForBook: EduContentTOCInterface[];
        eduContentTOCEduContent: EduContentTOCEduContentInterface[];
        bestResultByEduContentId: { [id: number]: ResultInterface };
      };
      expected: ChapterWithStatus[];
    }[] = [
      {
        it: 'should return correct statuses for each chapter',
        input: {
          treeForBook,
          eduContentTOCEduContent,
          bestResultByEduContentId
        },
        expected: [
          {
            tocId: 1,
            title: 'Chapter 1',
            exercises: {
              available: 3,
              completed: 2
            },
            kwetonsRemaining: 80
          },
          {
            tocId: 3,
            title: 'Chapter 2',
            exercises: {
              available: 4,
              completed: 1
            },
            kwetonsRemaining: 90
          }
        ]
      },
      {
        it: 'should return correct statuses for each chapter - no results',
        input: {
          treeForBook,
          eduContentTOCEduContent,
          bestResultByEduContentId: {}
        },
        expected: [
          {
            tocId: 1,
            title: 'Chapter 1',
            exercises: {
              available: 3,
              completed: 0
            },
            kwetonsRemaining: 90
          },
          {
            tocId: 3,
            title: 'Chapter 2',
            exercises: {
              available: 4,
              completed: 0
            },
            kwetonsRemaining: 120
          }
        ]
      }
    ];

    testCases.forEach(testCase => {
      it(testCase.it, () => {
        const result = projector(
          testCase.input.treeForBook,
          testCase.input.eduContentTOCEduContent,
          testCase.input.bestResultByEduContentId
        );

        expect(result).toEqual(testCase.expected);
      });
    });
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
          name: 'Katapult 1'
        },
        {
          bookId: 4,
          logoUrl: 'assets/methods/bar.jpg',
          learningAreaName: 'Spelling',
          name: 'Kameleon 2'
        },
        {
          bookId: 5,
          logoUrl: 'assets/methods/foo.jpg',
          learningAreaName: 'Rekenen',
          name: 'Katapult 1, 2'
        }
      ]);
    });
  });
});
