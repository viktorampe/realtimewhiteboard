import { EduContentTocQueries } from '.';
import { EduContentTOCInterface } from '../../+models';
import { EduContentTOCFixture } from './../../+fixtures/EduContentTOC.fixture';
import { State } from './edu-content-toc.reducer';

describe('EduContentToc Selectors', () => {
  function createEduContentToc(id: number): EduContentTOCInterface | any {
    return {
      id: id
    };
  }

  function createState(
    eduContentTocs: EduContentTOCInterface[],
    loadedBooks: number[],
    error?: any
  ): State {
    return {
      ids: eduContentTocs
        ? eduContentTocs.map(eduContentToc => eduContentToc.id)
        : [],
      entities: eduContentTocs
        ? eduContentTocs.reduce(
            (entityMap, eduContentToc) => ({
              ...entityMap,
              [eduContentToc.id]: eduContentToc
            }),
            {}
          )
        : {},
      loadedBooks,
      error: error
    };
  }

  let eduContentTocState: State;
  let storeState: any;

  describe('EduContentToc Selectors', () => {
    beforeEach(() => {
      eduContentTocState = createState(
        [
          createEduContentToc(4),
          createEduContentToc(1),
          createEduContentToc(2),
          createEduContentToc(3)
        ],
        [1],
        'no error'
      );
      storeState = { eduContentTocs: eduContentTocState };
    });

    it('getError() should return the error', () => {
      const results = EduContentTocQueries.getError(storeState);
      expect(results).toBe(eduContentTocState.error);
    });
    it('getAll() should return an array of the entities in the order from the ids', () => {
      const results = EduContentTocQueries.getAll(storeState);
      expect(results).toEqual([
        createEduContentToc(4),
        createEduContentToc(1),
        createEduContentToc(2),
        createEduContentToc(3)
      ]);
    });
    it('getCount() should return number of entities', () => {
      const results = EduContentTocQueries.getCount(storeState);
      expect(results).toBe(4);
    });
    it('getIds() should return an array with ids in the correct order', () => {
      const results = EduContentTocQueries.getIds(storeState);
      expect(results).toEqual([4, 1, 2, 3]);
    });
    it('getAllEntities() should return a key value object with all the entities', () => {
      const results = EduContentTocQueries.getAllEntities(storeState);
      expect(results).toEqual(eduContentTocState.entities);
    });
    it('getByIds() should return an array of the requested entities in order and undefined if the id is not present', () => {
      const results = EduContentTocQueries.getByIds(storeState, {
        ids: [3, 1, 90, 2]
      });
      expect(results).toEqual([
        createEduContentToc(3),
        createEduContentToc(1),
        undefined,
        createEduContentToc(2)
      ]);
    });
    it('getById() should return the desired entity', () => {
      const results = EduContentTocQueries.getById(storeState, { id: 2 });
      expect(results).toEqual(createEduContentToc(2));
    });
    it('getById() should return undefined if the entity is not present', () => {
      const results = EduContentTocQueries.getById(storeState, { id: 9 });
      expect(results).toBe(undefined);
    });

    describe('isBookLoaded', () => {
      it('should return false if the book has not been loaded', () => {
        const results = EduContentTocQueries.isBookLoaded(storeState, {
          bookId: 9
        });
        expect(results).toBe(false);
      });

      it('should return true if the book has been loaded', () => {
        const results = EduContentTocQueries.isBookLoaded(storeState, {
          bookId: 1
        });
        expect(results).toBe(true);
      });
    });

    describe('getTocsByBook', () => {
      let mockTOCs: EduContentTOCInterface[];

      beforeEach(() => {
        mockTOCs = [
          new EduContentTOCFixture({ id: 4, treeId: 1 }),
          new EduContentTOCFixture({ id: 1, treeId: 1 }),
          new EduContentTOCFixture({ id: 2, treeId: 2 }),
          new EduContentTOCFixture({ id: 3, treeId: 2 })
        ];

        eduContentTocState = createState(mockTOCs, [1], 'no error');
        storeState = { eduContentTocs: eduContentTocState };
      });

      it('should return the tocs grouped by treeId', () => {
        const results = EduContentTocQueries.getTocsByBook(storeState);
        expect(results).toEqual({
          1: [mockTOCs[0], mockTOCs[1]],
          2: [mockTOCs[2], mockTOCs[3]]
        });
      });
    });

    describe('getTocsForBook', () => {
      let mockTOCs: EduContentTOCInterface[];

      beforeEach(() => {
        mockTOCs = [
          new EduContentTOCFixture({ id: 4, treeId: 1 }),
          new EduContentTOCFixture({ id: 1, treeId: 1 }),
          new EduContentTOCFixture({ id: 2, treeId: 2 }),
          new EduContentTOCFixture({ id: 3, treeId: 2 })
        ];

        eduContentTocState = createState(mockTOCs, [1], 'no error');
        storeState = { eduContentTocs: eduContentTocState };
      });

      it('should return the correct tocs', () => {
        const results = EduContentTocQueries.getTocsForBook(storeState, {
          bookId: 1
        });
        expect(results).toEqual([mockTOCs[0], mockTOCs[1]]);
      });
    });

    describe('getChaptersForBook', () => {
      let chapterTOCs: EduContentTOCInterface[];

      beforeEach(() => {
        chapterTOCs = [
          new EduContentTOCFixture({
            id: 1,
            treeId: 1,
            depth: 0,
            lft: 1,
            rgt: 4
          }),
          new EduContentTOCFixture({
            id: 2,
            treeId: 1,
            depth: 0,
            lft: 5,
            rgt: 8
          })
        ];

        const mockTOCs = [
          ...chapterTOCs,
          new EduContentTOCFixture({
            id: 3,
            treeId: 1,
            depth: 1,
            lft: 2,
            rgt: 3
          }),
          new EduContentTOCFixture({
            id: 4,
            treeId: 1,
            depth: 1,
            lft: 6,
            rgt: 7
          })
        ];

        eduContentTocState = createState(mockTOCs, [1], 'no error');
        storeState = { eduContentTocs: eduContentTocState };
      });

      it('should return the chapters for the current book', () => {
        const results = EduContentTocQueries.getChaptersForBook(storeState, {
          bookId: 1
        });
        expect(results).toEqual(chapterTOCs);
      });
    });

    describe('getTocsForToc', () => {
      let mockTOCs: EduContentTOCInterface[];

      beforeEach(() => {
        mockTOCs = [
          new EduContentTOCFixture({
            id: 4,
            treeId: 1,
            depth: 1,
            lft: 2,
            rgt: 3
          }),
          new EduContentTOCFixture({
            // parent toc
            id: 1,
            treeId: 1,
            depth: 0,
            lft: 1,
            rgt: 10
          }),
          new EduContentTOCFixture({
            // wrong tree, correct depth, correct lft/rgt
            id: 3,
            treeId: 2,
            depth: 1,
            lft: 2,
            rgt: 3
          }),
          new EduContentTOCFixture({
            id: 5,
            treeId: 1,
            depth: 1,
            lft: 4,
            rgt: 7
          }),
          new EduContentTOCFixture({
            // correct tree, correct depth, wrong lft/rgt
            id: 6,
            treeId: 1,
            depth: 1,
            lft: 8,
            rgt: 11
          }),
          new EduContentTOCFixture({
            // correct tree, wrong depth, correct lft/rgt
            id: 7,
            treeId: 1,
            depth: 2,
            lft: 5,
            rgt: 6
          })
        ];

        eduContentTocState = createState(mockTOCs, [1], 'no error');
        storeState = { eduContentTocs: eduContentTocState };
      });

      it('should return the correct tocs', () => {
        const results = EduContentTocQueries.getTocsForToc(storeState, {
          tocId: 1
        });
        expect(results).toEqual([mockTOCs[0], mockTOCs[3]]);
      });
    });
  });

  describe('getTreeForBook', () => {
    let mockTOCs: EduContentTOCInterface[];

    beforeEach(() => {
      mockTOCs = [
        new EduContentTOCFixture({
          id: 1,
          treeId: 1,
          depth: 0,
          lft: 1,
          rgt: 6,
          children: []
        }),
        new EduContentTOCFixture({
          id: 2,
          treeId: 1,
          depth: 1,
          lft: 2,
          rgt: 3,
          children: []
        }),
        new EduContentTOCFixture({
          id: 3,
          treeId: 1,
          depth: 1,
          lft: 4,
          rgt: 5,
          children: []
        }),
        new EduContentTOCFixture({
          id: 4,
          treeId: 1,
          depth: 0,
          lft: 7,
          rgt: 12,
          children: []
        }),
        new EduContentTOCFixture({
          id: 5,
          treeId: 1,
          depth: 1,
          lft: 8,
          rgt: 11,
          children: []
        }),
        new EduContentTOCFixture({
          id: 6,
          treeId: 1,
          depth: 2,
          lft: 9,
          rgt: 10,
          children: []
        }),
        // Unrelated book:
        new EduContentTOCFixture({
          id: 7,
          treeId: 2,
          depth: 0,
          lft: 1,
          rgt: 1,
          children: []
        })
      ];

      eduContentTocState = createState(mockTOCs, [1], 'no error');
      storeState = { eduContentTocs: eduContentTocState };
    });

    it('should return the correct tocs', () => {
      const results = EduContentTocQueries.getTreeForBook(storeState, {
        bookId: 1
      });
      const expected = [
        Object.assign(mockTOCs[0], {
          children: [mockTOCs[1], mockTOCs[2]]
        }),
        Object.assign(mockTOCs[3], {
          children: [
            Object.assign(mockTOCs[4], {
              children: [mockTOCs[5]]
            })
          ]
        })
      ];

      expect(results).toEqual(expected);
    });
  });

  describe('getTocsForBookAndLearningPlanGoal', () => {
    let mockTOCs: EduContentTOCInterface[];

    beforeEach(() => {
      mockTOCs = [
        new EduContentTOCFixture({
          id: 4,
          treeId: 1,
          learningPlanGoalIds: [1, 2]
        }),
        new EduContentTOCFixture({
          id: 1,
          treeId: 1,
          learningPlanGoalIds: [1, 2, 3]
        }),
        new EduContentTOCFixture({
          id: 2,
          treeId: 2,
          learningPlanGoalIds: [1, 2, 3]
        }),
        new EduContentTOCFixture({
          id: 3,
          treeId: 2,
          learningPlanGoalIds: [2, 3, 4]
        })
      ];

      eduContentTocState = createState(mockTOCs, [1], 'no error');
      storeState = { eduContentTocs: eduContentTocState };
    });

    it('should return the tocs for a book with the specified learningPlanGoal', () => {
      const tests = [
        {
          props: { bookId: 1, learningPlanGoalId: 1 },
          expectedResult: [mockTOCs[0], mockTOCs[1]]
        },
        {
          props: { bookId: 1, learningPlanGoalId: 2 },
          expectedResult: [mockTOCs[0], mockTOCs[1]]
        },
        {
          props: { bookId: 1, learningPlanGoalId: 3 },
          expectedResult: [mockTOCs[1]]
        },
        {
          props: { bookId: 1, learningPlanGoalId: 4 },
          expectedResult: []
        },
        {
          props: { bookId: 2, learningPlanGoalId: 1 },
          expectedResult: [mockTOCs[2]]
        },
        {
          props: { bookId: 2, learningPlanGoalId: 2 },
          expectedResult: [mockTOCs[2], mockTOCs[3]]
        },
        {
          props: { bookId: 2, learningPlanGoalId: 4 },
          expectedResult: [mockTOCs[3]]
        }
      ];

      tests.forEach(test => {
        const results = EduContentTocQueries.getTocsForBookAndLearningPlanGoal(
          storeState,
          test.props
        );
        expect(results).toEqual(test.expectedResult);
      });
    });
  });

  describe('getLessonDisplaysForBook', () => {
    /**
     *  book 1
     *  - 1 (lpg 1,2)
     *    - 2
     *    - 3
     *      - 4 (lpg 2)
     *    - 5 (lpg 2,3)
     *
     * book 2
     *  - 6 (lpg 1)
     *    - 7 (lpg 2)
     */

    const mockTOCs = [
      new EduContentTOCFixture({
        id: 1,
        treeId: 1,
        depth: 0,
        title: 'b1_1',
        lft: 1,
        rgt: 10,
        learningPlanGoalIds: [1, 2]
      }),
      new EduContentTOCFixture({
        id: 2,
        treeId: 1,
        depth: 1,
        title: 'b1_1_2',
        lft: 2,
        rgt: 3,
        learningPlanGoalIds: []
      }),
      new EduContentTOCFixture({
        id: 3,
        treeId: 1,
        depth: 1,
        title: 'b1_1_3',
        lft: 4,
        rgt: 7,
        learningPlanGoalIds: []
      }),
      new EduContentTOCFixture({
        id: 4,
        treeId: 1,
        depth: 2,
        title: 'b1_1_3_4',
        lft: 5,
        rgt: 6,
        learningPlanGoalIds: [2]
      }),
      new EduContentTOCFixture({
        id: 5,
        treeId: 1,
        depth: 1,
        title: 'b1_1_5',
        lft: 8,
        rgt: 9,
        learningPlanGoalIds: [2, 3]
      }),
      new EduContentTOCFixture({
        id: 6,
        treeId: 2,
        depth: 0,
        title: 'b2_6',
        lft: 1,
        rgt: 4,
        learningPlanGoalIds: [1]
      }),
      new EduContentTOCFixture({
        id: 7,
        treeId: 2,
        depth: 1,
        title: 'b2_6_7',
        lft: 2,
        rgt: 3,
        learningPlanGoalIds: [2]
      })
    ];

    beforeEach(() => {
      eduContentTocState = createState(mockTOCs, [1, 2, 3], 'no error');
      storeState = { eduContentTocs: eduContentTocState };
    });

    const tests = [
      {
        props: { bookId: 1, learningPlanGoalId: 1 },
        expectedResult: [{ eduContentTocId: 1, values: ['b1_1'] }]
      },
      {
        props: { bookId: 1, learningPlanGoalId: 2 },
        expectedResult: [
          { eduContentTocId: 1, values: ['b1_1'] },
          { eduContentTocId: 4, values: ['b1_1_3_4'] }, // no direct parent in chaptersForBook
          { eduContentTocId: 5, values: ['b1_1', 'b1_1_5'] }
        ]
      },
      {
        props: { bookId: 1, learningPlanGoalId: 3 },
        expectedResult: [{ eduContentTocId: 5, values: ['b1_1', 'b1_1_5'] }]
      },
      {
        props: { bookId: 2, learningPlanGoalId: 3 }, // no toc with lpg
        expectedResult: []
      },
      {
        props: { bookId: 3, learningPlanGoalId: 1 }, // no tocs for book
        expectedResult: []
      }
    ];

    tests.forEach(test => {
      it('should return the correct display values', () => {
        const results = EduContentTocQueries.getLessonDisplaysForBook(
          storeState,
          test.props
        );
        expect(results).toEqual(test.expectedResult);
      });
    });
  });
});
