import { MockDate } from '@campus/testing';
import { HumanDateTimePipe } from './human-date-time.pipe';

describe('HumanDateTimePipe', () => {
  let pipe: HumanDateTimePipe;

  // woensdag 24 oktober 2018
  const dateMock = new MockDate(new Date(1540375469127));
  let date: Date;

  afterAll(() => {
    dateMock.returnRealDate();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  beforeEach(() => {
    pipe = new HumanDateTimePipe();

    // this creates a copy of the mocked date
    // so it's not accidentally mutated
    date = new Date(dateMock.mockDate);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  describe('transform', () => {
    beforeEach(() => {
      // just to make sure the passed date is not the referenceDate
      date.setFullYear(1999);
    });

    const rules = [0, 1, 2].map(index => ({
      condition: jest.fn(),
      value: jest.fn()
    }));

    const args = { rules, locale: 'en-US' };

    it('should test the conditions', () => {
      pipe.transform(date, args);

      rules.forEach(rule => {
        expect(rule.condition).toHaveBeenCalledTimes(1);
        expect(rule.condition).toHaveBeenCalledWith(
          date.getTime(),
          dateMock.mockDate.getTime()
        );
      });
    });

    it('should test the conditions in the correct order', () => {
      args.rules[0].condition.mockReturnValue(true);
      pipe.transform(date, args);

      expect(rules[0].condition).toHaveBeenCalled();
      expect(rules[1].condition).not.toHaveBeenCalled();
      expect(rules[2].condition).not.toHaveBeenCalled();

      jest.resetAllMocks();

      args.rules[0].condition.mockReturnValue(false);
      args.rules[1].condition.mockReturnValue(true);
      pipe.transform(date, args);

      expect(rules[0].condition).toHaveBeenCalled();
      expect(rules[1].condition).toHaveBeenCalled();
      expect(rules[2].condition).not.toHaveBeenCalled();
    });

    it('should return the value of the matched rule', () => {
      const mockReturn = 'foo bar';
      args.rules[1].value.mockReturnValue(mockReturn);

      args.rules[0].condition.mockReturnValue(false);
      args.rules[1].condition.mockReturnValue(true);
      const result = pipe.transform(date, args);

      expect(result).toBe(mockReturn);
      expect(rules[0].value).not.toHaveBeenCalled();
      expect(rules[1].value).toHaveBeenCalled();
      expect(rules[2].value).not.toHaveBeenCalled();
    });
  });

  // i.e. "the backwards compatibility tests"
  describe('default preset', () => {
    it('should show the text for less than a minute', () => {
      expect(pipe.transform(date)).toBe('zonet');
    });

    it('should show the text for 4 minutes ago', () => {
      date.setMinutes(date.getMinutes() - 4);

      const expected = '4 minuten geleden';
      expect(pipe.transform(date)).toBe(expected);
    });

    it('should show the text for 1 minute ago', () => {
      date.setMinutes(date.getMinutes() - 1);

      const expected = '1 minuut geleden';
      expect(pipe.transform(date)).toBe(expected);
    });

    it('should show the text for 4 hours ago', () => {
      date.setHours(date.getHours() - 4);

      const expected = '4 uren geleden';
      expect(pipe.transform(date)).toBe(expected);
    });

    it('should show the text for 1 hour ago', () => {
      date.setHours(date.getHours() - 1);

      const expected = '1 uur geleden';
      expect(pipe.transform(date)).toBe(expected);
    });

    it('should show the text for 23 hours ago', () => {
      date.setHours(date.getHours() - 23);

      const expected = '23 uren geleden';
      expect(pipe.transform(date)).toBe(expected);
    });

    it('should not show the hours text when its exactly 24 hours ago', () => {
      date.setHours(date.getHours() - 24);

      const expected = 'Dinsdag';
      expect(pipe.transform(date)).toBe(expected);
    });

    const testCasesWeekDay = [
      { daysAgo: 1, expected: 'Dinsdag' },
      { daysAgo: 2, expected: 'Maandag' },
      { daysAgo: 3, expected: 'Zondag' },
      { daysAgo: 4, expected: 'Zaterdag' },
      { daysAgo: 5, expected: 'Vrijdag' },
      { daysAgo: 6, expected: 'Donderdag' }
    ];
    testCasesWeekDay.forEach(testCase => {
      const { daysAgo, expected } = testCase;
      it(`should show the text for ${daysAgo} day(s) ago`, () => {
        date.setDate(date.getDate() - daysAgo);

        expect(pipe.transform(date)).toBe(expected);
      });
    });

    it('should show the text for dateformat', () => {
      date.setDate(date.getDate() - 7);

      const expected = date.toLocaleDateString('nl-BE');
      expect(pipe.transform(date)).toBe(expected);
    });

    it('should return an empty string when null date', () => {
      expect(pipe.transform(null)).toBe('');
    });

    it('should return an empty string when undefined date', () => {
      expect(pipe.transform(undefined)).toBe('');
    });
  });
});
