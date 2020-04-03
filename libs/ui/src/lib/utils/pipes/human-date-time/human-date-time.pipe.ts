import { Pipe, PipeTransform } from '@angular/core';
import { HumanDateTimeArgsInterface } from './human-date-time.pipe.interface';
import { humanDateTimeDefaultArgs } from './human-date-time.pipe.presets';

@Pipe({
  name: 'humanDateTime'
})
export class HumanDateTimePipe implements PipeTransform {
  /**
   * takes a date object and transforms it to a human readable string
   * returns empty string when date is undefined or null
   */
  transform(
    value: Date | number | string,
    args: HumanDateTimeArgsInterface = humanDateTimeDefaultArgs
  ): string {
    if (!value) return '';

    if (!(value instanceof Date)) {
      value = new Date(value);
    }

    const {
      referenceDate = new Date(),
      rules,
      locale = 'nl-BE',
      datePrefix,
      addDate
    } = args;

    for (const rule of rules) {
      const valueMilliSeconds = value.getTime();
      const referenceMilliSeconds = referenceDate.getTime();

      if (rule.condition(valueMilliSeconds, referenceMilliSeconds)) {
        return (
          rule.value(valueMilliSeconds, referenceMilliSeconds) +
          (addDate ? ' (' + value.toLocaleDateString(locale) + ')' : '')
        );
      }
    }

    const prefix = datePrefix ? datePrefix + ' ' : '';

    return prefix + value.toLocaleDateString(locale);
  }
}
