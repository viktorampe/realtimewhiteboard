import { DateFunctions } from '.';

describe('DateFunctions', () => {
  // used to map 0-6 to days of the week for test case descriptinos
  const days = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday'
  ];

  describe('startOfWeek', () => {
    const testCases = [
      {
        it:
          'should return the start of the week - first day of january (tuesday)',
        input: new Date(2019, 0, 1, 8, 16, 24, 32),
        expected: new Date(2018, 11, 31, 0, 0, 0, 0)
      },
      ...Array.from(new Array(7).keys()).map(i => {
        return {
          it: 'should return the start of the week - ' + days[i],
          input: new Date(2019, 11, 2 + i, 8, 16, 24, 32),
          expected: new Date(2019, 11, 2, 0, 0, 0, 0)
        };
      })
    ];

    testCases.forEach(testCase => {
      it(testCase.it, () => {
        expect(DateFunctions.startOfWeek(testCase.input)).toEqual(
          testCase.expected
        );
      });
    });
  });

  describe('endOfWeek', () => {
    const testCases = [
      {
        it: 'should return the end of the week - last day of december (monday)',
        input: new Date(2018, 11, 31, 8, 16, 24, 32),
        expected: new Date(2019, 0, 6, 23, 59, 59, 999)
      },
      ...Array.from(new Array(7).keys()).map(i => {
        return {
          it: 'should return the end of the week - ' + days[i],
          input: new Date(2019, 11, 2 + i, 8, 16, 24, 32),
          expected: new Date(2019, 11, 8, 23, 59, 59, 999)
        };
      })
    ];

    testCases.forEach(testCase => {
      it(testCase.it, () => {
        expect(DateFunctions.endOfWeek(testCase.input)).toEqual(
          testCase.expected
        );
      });
    });
  });

  describe('nextWeek', () => {
    const testCases = [
      {
        it:
          'should return the beginning of next week - last day of january (thursday)',
        input: new Date(2019, 0, 31, 8, 16, 24, 32),
        expected: new Date(2019, 1, 4, 0, 0, 0, 0)
      },
      ...Array.from(new Array(7).keys()).map(i => {
        return {
          it: 'should return the beginning of next week - ' + days[i],
          input: new Date(2019, 11, 2 + i, 8, 16, 24, 32),
          expected: new Date(2019, 11, 9, 0, 0, 0, 0)
        };
      })
    ];

    testCases.forEach(testCase => {
      it(testCase.it, () => {
        expect(DateFunctions.nextWeek(testCase.input)).toEqual(
          testCase.expected
        );
      });
    });
  });

  describe('lastWeek', () => {
    const testCases = [
      {
        it:
          'should return the start of last week - first day of january (tuesday)',
        input: new Date(2019, 0, 1, 8, 16, 24, 32),
        expected: new Date(2018, 11, 24, 0, 0, 0, 0)
      },
      ...Array.from(new Array(7).keys()).map(i => {
        return {
          it: 'should return the start of last week - ' + days[i],
          input: new Date(2019, 11, 2 + i, 8, 16, 24, 32),
          expected: new Date(2019, 10, 25, 0, 0, 0, 0)
        };
      })
    ];

    testCases.forEach(testCase => {
      it(testCase.it, () => {
        expect(DateFunctions.lastWeek(testCase.input)).toEqual(
          testCase.expected
        );
      });
    });
  });

  describe('getSchoolYearBoundaries', () => {
    const testCases = [
      {
        date: new Date(2019, 11, 31),
        expected: {
          start: new Date(2019, 8, 1),
          end: new Date(2020, 5, 30)
        }
      },
      {
        date: new Date(2020, 0, 1),
        expected: {
          start: new Date(2019, 8, 1),
          end: new Date(2020, 5, 30)
        }
      },
      {
        date: new Date(2019, 7, 31),
        expected: {
          start: new Date(2018, 8, 1),
          end: new Date(2019, 5, 30)
        }
      },
      {
        date: new Date(2021, 8, 1),
        expected: {
          start: new Date(2021, 8, 1),
          end: new Date(2022, 5, 30)
        }
      },
      {
        date: new Date(2019, 5, 30),
        expected: {
          start: new Date(2018, 8, 1),
          end: new Date(2019, 5, 30)
        }
      }
    ];

    testCases.forEach((testCase, index) =>
      it('should return the correct boundaries - ' + index + 1, () => {
        const result = DateFunctions.getSchoolYearBoundaries(testCase.date);
        expect(result).toEqual(testCase.expected);
      })
    );
  });
});
