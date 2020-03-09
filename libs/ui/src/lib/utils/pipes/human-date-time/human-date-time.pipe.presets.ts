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
  'PAST_WEEKDAY'
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
      referenceDate > date &&
      referenceDate - date >= minute &&
      referenceDate - date < hour,
    value: (date, referenceDate) => {
      const timeInMinutes = Math.floor((referenceDate - date) / minute);
      return `${timeInMinutes} ${
        timeInMinutes === 1 ? 'minuut' : 'minuten'
      } geleden`;
    }
  },
  [humanDateTimeRulesEnum.PAST_HOURS]: {
    condition: (date, referenceDate) =>
      referenceDate > date &&
      referenceDate - date >= hour &&
      referenceDate - date < day,
    value: (date, referenceDate) => {
      const timeInHours = Math.floor((referenceDate - date) / hour);
      return `${timeInHours} ${timeInHours === 1 ? 'uur' : 'uren'} geleden`;
    }
  },
  [humanDateTimeRulesEnum.PAST_DAYS]: {
    condition: (date, referenceDate) =>
      referenceDate > date &&
      referenceDate - date >= day &&
      referenceDate - date < week,
    value: (date, referenceDate) => {
      const timeInDays = Math.floor((referenceDate - date) / day);
      return `${timeInDays} ${timeInDays === 1 ? 'dag' : 'dagen'} geleden`;
    }
  },
  [humanDateTimeRulesEnum.PAST_WEEKDAY]: {
    condition: (date, referenceDate) =>
      referenceDate > date &&
      referenceDate - date >= day &&
      referenceDate - date < week,
    value: (date, referenceDate) => {
      const dayOfWeek = new Date(date).getDay();
      return weekdays[dayOfWeek];
    }
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
