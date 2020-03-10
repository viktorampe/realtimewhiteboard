import {
  getHumanDateTimeRules,
  humanDateTimeRulesEnum
} from './human-date-time.pipe.presets';

describe('HumanDateTimePipe rules', () => {
  describe('PAST_JUST', () => {
    const referenceDate = new Date().getTime();
    const rule = getHumanDateTimeRules(humanDateTimeRulesEnum.PAST_JUST)[0];
    const second = 1000;

    const testCases = [
      {
        should: 'match the condition',
        date: referenceDate - 59 * second,
        expected: true
      },
      {
        should: 'match the condition',
        date: referenceDate,
        expected: true
      },
      {
        should: 'not match the condition - future value',
        date: referenceDate + 1,
        expected: false
      },
      {
        should: 'not match the condition - difference more than a minute',
        date: referenceDate - 60 * second,
        expected: false
      }
    ];

    testCases.forEach(testCase => {
      const { should, date, expected } = testCase;

      it('should' + should, () => {
        expect(rule.condition(date, referenceDate)).toBe(expected);
      });
    });

    it('should return the correct value', () => {
      expect(rule.value(referenceDate, referenceDate)).toBe('zonet');
    });
  });

  describe('PAST_MINUTES', () => {
    const referenceDate = new Date().getTime();
    const rule = getHumanDateTimeRules(humanDateTimeRulesEnum.PAST_MINUTES)[0];
    const minute = 60 * 1000;

    const testCases = [
      {
        should: 'match the condition',
        date: referenceDate - minute,
        expected: true
      },
      {
        should: 'match the condition',
        date: referenceDate - 59 * minute,
        expected: true
      },
      {
        should: 'not match the condition - future value',
        date: referenceDate + 1,
        expected: false
      },
      {
        should: 'not match the condition - difference more than an hour',
        date: referenceDate - 60 * minute,
        expected: false
      }
    ];

    testCases.forEach(testCase => {
      const { should, date, expected } = testCase;

      it('should' + should, () => {
        expect(rule.condition(date, referenceDate)).toBe(expected);
      });
    });

    it('should return the correct value - singular', () => {
      expect(rule.value(referenceDate - 1 * minute, referenceDate)).toBe(
        '1 minuut geleden'
      );
    });

    it('should return the correct value - plural', () => {
      expect(rule.value(referenceDate - 4 * minute, referenceDate)).toBe(
        '4 minuten geleden'
      );
    });
  });

  describe('PAST_HOURS', () => {
    const referenceDate = new Date().getTime();
    const rule = getHumanDateTimeRules(humanDateTimeRulesEnum.PAST_HOURS)[0];
    const hour = 60 * 60 * 1000;

    const testCases = [
      {
        should: 'match the condition',
        date: referenceDate - hour,
        expected: true
      },
      {
        should: 'match the condition',
        date: referenceDate - 23 * hour,
        expected: true
      },
      {
        should: 'not match the condition - future value',
        date: referenceDate + 1,
        expected: false
      },
      {
        should: 'not match the condition - difference more than a day',
        date: referenceDate - 24 * hour,
        expected: false
      }
    ];

    testCases.forEach(testCase => {
      const { should, date, expected } = testCase;

      it('should' + should, () => {
        expect(rule.condition(date, referenceDate)).toBe(expected);
      });
    });

    it('should return the correct value - singular', () => {
      expect(rule.value(referenceDate - 1 * hour, referenceDate)).toBe(
        '1 uur geleden'
      );
    });

    it('should return the correct value - plural', () => {
      expect(rule.value(referenceDate - 4 * hour, referenceDate)).toBe(
        '4 uren geleden'
      );
    });
  });

  describe('PAST_DAYS', () => {
    const referenceDate = new Date().getTime();
    const rule = getHumanDateTimeRules(humanDateTimeRulesEnum.PAST_DAYS)[0];
    const day = 24 * 60 * 60 * 1000;

    const testCases = [
      {
        should: 'match the condition',
        date: referenceDate - day,
        expected: true
      },
      {
        should: 'match the condition',
        date: referenceDate - 6 * day,
        expected: true
      },
      {
        should: 'not match the condition - future value',
        date: referenceDate + 1,
        expected: false
      },
      {
        should: 'not match the condition - difference more than a week',
        date: referenceDate - 7 * day,
        expected: false
      }
    ];

    testCases.forEach(testCase => {
      const { should, date, expected } = testCase;

      it('should' + should, () => {
        expect(rule.condition(date, referenceDate)).toBe(expected);
      });
    });

    it('should return the correct value - singular', () => {
      expect(rule.value(referenceDate - 1 * day, referenceDate)).toBe(
        '1 dag geleden'
      );
    });

    it('should return the correct value - plural', () => {
      expect(rule.value(referenceDate - 4 * day, referenceDate)).toBe(
        '4 dagen geleden'
      );
    });
  });

  describe('PAST_WEEKDAY', () => {
    const referenceDate = new Date().getTime();
    const rule = getHumanDateTimeRules(humanDateTimeRulesEnum.PAST_WEEKDAY)[0];
    const day = 24 * 60 * 60 * 1000;

    const testCases = [
      {
        should: 'match the condition',
        date: referenceDate - day,
        expected: true
      },
      {
        should: 'match the condition',
        date: referenceDate - 6 * day,
        expected: true
      },
      {
        should: 'not match the condition - future value',
        date: referenceDate + 1,
        expected: false
      },
      {
        should: 'not match the condition - difference more than a week',
        date: referenceDate - 7 * day,
        expected: false
      }
    ];

    testCases.forEach(testCase => {
      const { should, date, expected } = testCase;

      it('should' + should, () => {
        expect(rule.condition(date, referenceDate)).toBe(expected);
      });
    });

    const testCasesWeekDay = [
      { date: new Date(2020, 2, 9), expected: 'Maandag' },
      { date: new Date(2020, 2, 10), expected: 'Dinsdag' },
      { date: new Date(2020, 2, 11), expected: 'Woensdag' },
      { date: new Date(2020, 2, 12), expected: 'Donderdag' },
      { date: new Date(2020, 2, 13), expected: 'Vrijdag' },
      { date: new Date(2020, 2, 14), expected: 'Zaterdag' },
      { date: new Date(2020, 2, 15), expected: 'Zondag' }
    ];

    testCasesWeekDay.forEach(testCase => {
      const { date, expected } = testCase;
      it('should show the correct weekday', () => {
        expect(rule.value(date.getTime(), referenceDate)).toBe(expected);
      });
    });
  });
});
