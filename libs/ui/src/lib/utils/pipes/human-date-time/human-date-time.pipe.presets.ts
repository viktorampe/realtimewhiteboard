import {
  HumanDateTimeArgsInterface,
  HumanDateTimeRuleInterface
} from './human-date-time.pipe.interface';

const second = 1000;
const minute = 60 * second;
const hour = 60 * minute;
const day = 24 * hour;
const week = 7 * day;

const weekdays = [
  'Zondag',
  'Maandag',
  'Dinsdag',
  'Woensdag',
  'Donderdag',
  'Vrijdag',
  'Zaterdag'
];

export enum humanDateTimeRulesEnum {
  'PAST_JUST',
  'PAST_MINUTES',
  'PAST_HOURS',
  'PAST_DAYS',
  'PAST_WEEKDAY',
  'TODAY',
  'TOMORROW',
  'DAY_AFTER_TOMORROW',
  'WEEKDAY',
  'THIS_WEEK',
  'NEXT_WEEK',
  'DATE',
  'LATER',
  'EARLIER'
}

function midnight(date: number): number {
  return new Date(date).setHours(0, 0, 0, 0);
}

function startOfWeek(date: number, startDay: number = 1): number {
  // default startDay of week should be monday
  let dayOfWeek = new Date(date).getDay() - startDay;
  if (dayOfWeek < 0) {
    dayOfWeek += 7;
  }
  return midnight(date) - dayOfWeek * day;
}

const humanDateTimeRules: {
  [key: number]: HumanDateTimeRuleInterface;
} = {
  [humanDateTimeRulesEnum.PAST_JUST]: {
    condition: (date, referenceDate) =>
      referenceDate >= date && referenceDate - date < minute,
    value: (date, referenceDate) => 'zonet'
  },
  [humanDateTimeRulesEnum.PAST_MINUTES]: {
    condition: (date, referenceDate) =>
      referenceDate > date && referenceDate - date < hour,
    value: (date, referenceDate) => {
      const timeInMinutes = Math.floor((referenceDate - date) / minute);
      return `${timeInMinutes} ${
        timeInMinutes === 1 ? 'minuut' : 'minuten'
      } geleden`;
    }
  },
  [humanDateTimeRulesEnum.PAST_HOURS]: {
    condition: (date, referenceDate) =>
      referenceDate > date && referenceDate - date < day,
    value: (date, referenceDate) => {
      const timeInHours = Math.floor((referenceDate - date) / hour);
      return `${timeInHours} ${timeInHours === 1 ? 'uur' : 'uren'} geleden`;
    }
  },
  [humanDateTimeRulesEnum.PAST_DAYS]: {
    condition: (date, referenceDate) =>
      referenceDate > date && midnight(referenceDate) - midnight(date) < week,
    value: (date, referenceDate) => {
      const timeInDays = Math.floor((referenceDate - date) / day);
      return `${timeInDays} ${timeInDays === 1 ? 'dag' : 'dagen'} geleden`;
    }
  },
  [humanDateTimeRulesEnum.PAST_WEEKDAY]: {
    condition: (date, referenceDate) =>
      referenceDate > date && midnight(referenceDate) - midnight(date) < week,
    value: (date, referenceDate) => {
      const dayOfWeek = new Date(date).getDay();
      return weekdays[dayOfWeek];
    }
  },
  [humanDateTimeRulesEnum.TODAY]: {
    condition: (date, referenceDate) =>
      midnight(date) === midnight(referenceDate),
    value: (date, referenceDate) => 'vandaag'
  },
  [humanDateTimeRulesEnum.TOMORROW]: {
    condition: (date, referenceDate) =>
      midnight(date) === midnight(referenceDate) + day,
    value: (date, referenceDate) => 'morgen'
  },
  [humanDateTimeRulesEnum.DAY_AFTER_TOMORROW]: {
    condition: (date, referenceDate) =>
      midnight(date) === midnight(referenceDate) + 2 * day,
    value: (date, referenceDate) => 'overmorgen'
  },
  [humanDateTimeRulesEnum.WEEKDAY]: {
    condition: (date, referenceDate) =>
      referenceDate < date && midnight(date) - midnight(referenceDate) < week,
    value: (date, referenceDate) => {
      const dayOfWeek = new Date(date).getDay();
      return weekdays[dayOfWeek];
    }
  },
  [humanDateTimeRulesEnum.THIS_WEEK]: {
    condition: (date, referenceDate) => {
      const midnightDate = midnight(date);
      const weekStartDate = startOfWeek(referenceDate);
      return (
        midnightDate >= weekStartDate && midnightDate < weekStartDate + week
      );
    },
    value: (date, referenceDate) => 'deze week'
  },
  [humanDateTimeRulesEnum.NEXT_WEEK]: {
    condition: (date, referenceDate) => {
      const midnightDate = midnight(date);
      const nextWeekStartDate = startOfWeek(referenceDate) + week;
      return (
        midnightDate >= nextWeekStartDate &&
        midnightDate < nextWeekStartDate + week
      );
    },
    value: (date, referenceDate) => 'volgende week'
  },
  [humanDateTimeRulesEnum.LATER]: {
    condition: (date, referenceDate) => referenceDate < date,
    value: (date, referenceDate) => 'later'
  },
  [humanDateTimeRulesEnum.EARLIER]: {
    condition: (date, referenceDate) => referenceDate > date,
    value: (date, referenceDate) => 'vroeger'
  }
};

export function getHumanDateTimeRules(
  rules: humanDateTimeRulesEnum | humanDateTimeRulesEnum[]
) {
  if (!Array.isArray(rules)) rules = [rules];
  return rules.map(rule => humanDateTimeRules[rule]);
}

export const humanDateTimeDefaultArgs: HumanDateTimeArgsInterface = {
  rules: getHumanDateTimeRules([
    humanDateTimeRulesEnum.PAST_JUST,
    humanDateTimeRulesEnum.PAST_MINUTES,
    humanDateTimeRulesEnum.PAST_HOURS,
    humanDateTimeRulesEnum.PAST_WEEKDAY
  ])
};
