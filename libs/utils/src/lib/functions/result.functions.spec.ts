import { ResultFunctions } from '.';

describe('ResultFunctions', () => {
  describe('starsFromScore', () => {
    const testCases: { score: number; total?: number; expected: number }[] = [
      { score: 0, expected: 0 },
      { score: 49, expected: 0 },
      { score: 50, expected: 1 },
      { score: 74, expected: 1 },
      { score: 75, expected: 2 },
      { score: 99, expected: 2 },
      { score: 100, expected: 3 },
      // custom total
      { score: 3, total: 5, expected: 1 },
      { score: 4, total: 5, expected: 2 },
      { score: 4.999999999, total: 5, expected: 2 },
      { score: 5, total: 5, expected: 3 },
      // invalid inputs
      { score: 75, total: 0, expected: 0 },
      { score: undefined, total: undefined, expected: 0 },
      { score: 1000, total: 5, expected: 3 }
    ];

    testCases.forEach((testCase, index) => {
      it('should return the correct amount of stars - ' + index, () => {
        const stars = ResultFunctions.starsFromScore(
          testCase.score,
          testCase.total
        );

        expect(stars).toEqual(testCase.expected);
      });
    });
  });
});
