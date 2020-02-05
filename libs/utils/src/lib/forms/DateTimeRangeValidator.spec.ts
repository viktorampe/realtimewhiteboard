import { dateTimeRangeValidator } from '.';

describe('DateTimeRangeValidator', () => {
  let formValues: {
    startDateValue: Date;
    startTimeValue: string;
    endDateValue: Date;
    endTimeValue: string;
  };

  const mockFormGroup: any = {
    get: (name: string) => {
      return {
        startDate: {
          value: formValues.startDateValue
        },
        endDate: {
          value: formValues.endDateValue
        },
        startTime: {
          value: formValues.startTimeValue
        },
        endTime: {
          value: formValues.endTimeValue
        }
      }[name];
    }
  };

  const validator = dateTimeRangeValidator(
    'startDate',
    'startTime',
    'endDate',
    'endTime'
  );

  // The value to expect if the validator fails
  const validationError = { dateTimeRange: true };

  const testCases = [
    {
      it: 'should be valid - no start date and no end date',
      formValues: {
        startDateValue: null,
        startTimeValue: null,
        endDateValue: null,
        endTimeValue: null
      },
      expected: null
    },
    {
      it: 'should be valid - start date without end date',
      formValues: {
        startDateValue: new Date('1 sept 2000'),
        startTimeValue: null,
        endDateValue: null,
        endTimeValue: null
      },
      expected: null
    },
    {
      it: 'should be valid - end date without start date',
      formValues: {
        startDateValue: null,
        startTimeValue: null,
        endDateValue: new Date('1 sept 2000'),
        endTimeValue: null
      },
      expected: null
    },
    {
      it: 'should be valid - start date before end date',
      formValues: {
        startDateValue: new Date('1 sept 2000'),
        startTimeValue: null,
        endDateValue: new Date('2 sept 2000'),
        endTimeValue: null
      },
      expected: null
    },
    {
      it: 'should be valid - start date same as end date',
      formValues: {
        startDateValue: new Date('1 sept 2000'),
        startTimeValue: null,
        endDateValue: new Date('1 sept 2000'),
        endTimeValue: null
      },
      expected: null
    },
    {
      it: 'should be valid - start datetime before end datetime',
      formValues: {
        startDateValue: new Date('1 sept 2000'),
        startTimeValue: '10:00',
        endDateValue: new Date('2 sept 2000'),
        endTimeValue: '11:00'
      },
      expected: null
    },
    {
      it: 'should be valid - same date - start time before end time',
      formValues: {
        startDateValue: new Date('1 sept 2000'),
        startTimeValue: '10:00',
        endDateValue: new Date('1 sept 2000'),
        endTimeValue: '11:00'
      },
      expected: null
    },
    {
      it: 'should be valid - same date - same time',
      formValues: {
        startDateValue: new Date('1 sept 2000'),
        startTimeValue: '11:00',
        endDateValue: new Date('1 sept 2000'),
        endTimeValue: '11:00'
      },
      expected: null
    },
    {
      it: 'should be invalid - start date after end date',
      formValues: {
        startDateValue: new Date('2 sept 2000'),
        startTimeValue: null,
        endDateValue: new Date('1 sept 2000'),
        endTimeValue: null
      },
      expected: validationError
    },
    {
      it: 'should be invalid - start datetime after end datetime',
      formValues: {
        startDateValue: new Date('2 sept 2000'),
        startTimeValue: '10:00',
        endDateValue: new Date('1 sept 2000'),
        endTimeValue: '11:00'
      },
      expected: validationError
    },
    {
      it: 'should be invalid - same date - start time after end time',
      formValues: {
        startDateValue: new Date('1 sept 2000'),
        startTimeValue: '11:00',
        endDateValue: new Date('1 sept 2000'),
        endTimeValue: '10:00'
      },
      expected: validationError
    }
  ];

  testCases.forEach(testCase => {
    it(testCase.it, () => {
      formValues = testCase.formValues;

      const result = validator(mockFormGroup);

      expect(result).toEqual(testCase.expected);
    });
  });
});
