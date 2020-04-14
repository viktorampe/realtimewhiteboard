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

      it('should ' + should, () => {
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

      it('should ' + should, () => {
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

      it('should ' + should, () => {
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
        date: referenceDate - 8 * day,
        expected: false
      }
    ];

    testCases.forEach(testCase => {
      const { should, date, expected } = testCase;

      it('should ' + should, () => {
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
        date: referenceDate - 8 * day,
        expected: false
      }
    ];

    testCases.forEach(testCase => {
      const { should, date, expected } = testCase;

      it('should ' + should, () => {
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

  describe('TODAY', () => {
    const referenceDate = new Date().setHours(9, 0, 0, 0);
    const rule = getHumanDateTimeRules(humanDateTimeRulesEnum.TODAY)[0];
    const day = 24 * 60 * 60 * 1000;

    const testCases = [
      {
        should: 'match the condition',
        date: referenceDate,
        expected: true
      },
      {
        should: 'not match the condition - tomorrow',
        date: referenceDate + day,
        expected: false
      },
      {
        should: 'not match the condition - yesterday',
        date: referenceDate - day,
        expected: false
      }
    ];

    testCases.forEach(testCase => {
      const { should, date, expected } = testCase;

      it('should ' + should, () => {
        expect(rule.condition(date, referenceDate)).toBe(expected);
      });
    });

    it('should return the correct value - singular', () => {
      expect(rule.value(referenceDate, referenceDate)).toBe('vandaag');
    });
  });

  describe('TOMORROW', () => {
    const referenceDate = new Date().setHours(9, 0, 0, 0);
    const rule = getHumanDateTimeRules(humanDateTimeRulesEnum.TOMORROW)[0];
    const day = 24 * 60 * 60 * 1000;

    const testCases = [
      {
        should: 'match the condition',
        date: referenceDate + day,
        expected: true
      },
      {
        should: 'not match the condition - today',
        date: referenceDate,
        expected: false
      },
      {
        should: 'not match the condition - yesterday at 21h00',
        date: referenceDate - 0.5 * day,
        expected: false
      },
      {
        should: 'not match the condition - day after tomorrow',
        date: referenceDate + 2 * day,
        expected: false
      }
    ];

    testCases.forEach(testCase => {
      const { should, date, expected } = testCase;

      it('should ' + should, () => {
        expect(rule.condition(date, referenceDate)).toBe(expected);
      });
    });

    it('should return the correct value', () => {
      expect(rule.value(referenceDate + 1 * day, referenceDate)).toBe('morgen');
    });
  });

  describe('DAY_AFTER_TOMORROW', () => {
    const referenceDate = new Date().setHours(9, 0, 0, 0);
    const rule = getHumanDateTimeRules(
      humanDateTimeRulesEnum.DAY_AFTER_TOMORROW
    )[0];
    const day = 24 * 60 * 60 * 1000;

    const testCases = [
      {
        should: 'match the condition',
        date: referenceDate + 2 * day,
        expected: true
      },
      {
        should: 'not match the condition - tomorrow at 21h00',
        date: referenceDate + 1.5 * day,
        expected: false
      },
      {
        should: 'not match the condition - in 3 days',
        date: referenceDate + 3 * day,
        expected: false
      }
    ];

    testCases.forEach(testCase => {
      const { should, date, expected } = testCase;

      it('should ' + should, () => {
        expect(rule.condition(date, referenceDate)).toBe(expected);
      });
    });

    it('should return the correct value', () => {
      expect(rule.value(referenceDate + 2 * day, referenceDate)).toBe(
        'overmorgen'
      );
    });
  });

  describe('WEEKDAY', () => {
    const referenceDate = new Date().setHours(9, 0, 0, 0);
    const rule = getHumanDateTimeRules(humanDateTimeRulesEnum.WEEKDAY)[0];
    const day = 24 * 60 * 60 * 1000;

    const testCases = [
      {
        should: 'match the condition',
        date: referenceDate + day,
        expected: true
      },
      {
        should: 'match the condition',
        date: referenceDate + 6 * day,
        expected: true
      },
      {
        should: 'not match the condition - past value',
        date: referenceDate - 1,
        expected: false
      },
      {
        should: 'not match the condition - difference more than a week',
        date: referenceDate + 8 * day,
        expected: false
      }
    ];

    testCases.forEach(testCase => {
      const { should, date, expected } = testCase;

      it('should ' + should, () => {
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

  describe('THIS_WEEK', () => {
    const referenceDate = new Date(2020, 2, 10, 9).getTime(); // tuesday at 9h00
    const rule = getHumanDateTimeRules(humanDateTimeRulesEnum.THIS_WEEK)[0];
    const day = 24 * 60 * 60 * 1000;

    const testCases = [
      ...[-1, 0, 1, 2, 3, 4, 5].map(i => ({
        should: 'match the condition',
        date: referenceDate + i * day,
        expected: true
      })),
      {
        should: 'not match the condition - next monday',
        date: referenceDate + 6 * day,
        expected: false
      },
      {
        should: 'not match the condition - last sunday',
        date: referenceDate - 2 * day,
        expected: false
      }
    ];

    testCases.forEach(testCase => {
      const { should, date, expected } = testCase;

      it('should ' + should, () => {
        expect(rule.condition(date, referenceDate)).toBe(expected);
      });
    });

    it('should return the correct value', () => {
      expect(rule.value(referenceDate + 2 * day, referenceDate)).toBe(
        'deze week'
      );
    });
  });

  describe('NEXT_WEEK', () => {
    const referenceDate = new Date(2020, 2, 10, 9).getTime(); // tuesday at 9h00
    const rule = getHumanDateTimeRules(humanDateTimeRulesEnum.NEXT_WEEK)[0];
    const day = 24 * 60 * 60 * 1000;

    const testCases = [
      ...[-1, 0, 1, 2, 3, 4, 5].map(i => ({
        should: 'match the condition',
        date: referenceDate + (i + 7) * day,
        expected: true
      })),
      {
        should: 'not match the condition - this week on sunday',
        date: referenceDate + 5 * day,
        expected: false
      },
      {
        should: 'not match the condition - in 2 weeks',
        date: referenceDate + 14 * day,
        expected: false
      }
    ];

    testCases.forEach(testCase => {
      const { should, date, expected } = testCase;

      it('should ' + should, () => {
        expect(rule.condition(date, referenceDate)).toBe(expected);
      });
    });

    it('should return the correct value', () => {
      expect(rule.value(referenceDate + 2 * day, referenceDate)).toBe(
        'volgende week'
      );
    });
  });

  describe('PAST_WEEK', () => {
    const referenceDate = new Date(2020, 2, 10, 9).getTime(); // tuesday at 9h00
    const rule = getHumanDateTimeRules(humanDateTimeRulesEnum.PAST_WEEK)[0];
    const day = 24 * 60 * 60 * 1000;

    const testCases = [
      ...[-1, 0, 1, 2, 3, 4, 5].map(i => ({
        should: 'match the condition',
        date: referenceDate + (i - 7) * day,
        expected: true
      })),
      {
        should: 'not match the condition - yesterday (monday)',
        date: referenceDate - 1 * day,
        expected: false
      },
      {
        should: 'not match the condition - in 2 weeks',
        date: referenceDate - 14 * day,
        expected: false
      }
    ];

    testCases.forEach(testCase => {
      const { should, date, expected } = testCase;

      it('should ' + should, () => {
        expect(rule.condition(date, referenceDate)).toBe(expected);
      });
    });

    it('should return the correct value', () => {
      expect(rule.value(referenceDate - 2 * day, referenceDate)).toBe(
        'vorige week'
      );
    });
  });
  describe('LATER', () => {
    const referenceDate = new Date().getTime();
    const rule = getHumanDateTimeRules(humanDateTimeRulesEnum.LATER)[0];
    const day = 24 * 60 * 60 * 1000;

    const testCases = [
      {
        should: 'match the condition - future',
        date: referenceDate + 1,
        expected: true
      },
      {
        should: 'not match the condition - past',
        date: referenceDate - 1,
        expected: false
      }
    ];

    testCases.forEach(testCase => {
      const { should, date, expected } = testCase;

      it('should ' + should, () => {
        expect(rule.condition(date, referenceDate)).toBe(expected);
      });
    });

    it('should return the correct value', () => {
      expect(rule.value(referenceDate + 2 * day, referenceDate)).toBe('later');
    });
  });

  describe('EARLIER', () => {
    const referenceDate = new Date().getTime();
    const rule = getHumanDateTimeRules(humanDateTimeRulesEnum.EARLIER)[0];
    const day = 24 * 60 * 60 * 1000;

    const testCases = [
      {
        should: 'match the condition - past',
        date: referenceDate - 1,
        expected: true
      },
      {
        should: 'not match the condition - future',
        date: referenceDate + 1,
        expected: false
      }
    ];

    testCases.forEach(testCase => {
      const { should, date, expected } = testCase;

      it('should ' + should, () => {
        expect(rule.condition(date, referenceDate)).toBe(expected);
      });
    });

    it('should return the correct value', () => {
      expect(rule.value(referenceDate + 2 * day, referenceDate)).toBe(
        'vroeger'
      );
    });
  });
});
