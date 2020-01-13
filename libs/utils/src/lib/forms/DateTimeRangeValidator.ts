import { FormGroup, ValidatorFn } from '@angular/forms';

export function dateTimeRangeValidator(
  startDateControlName: string,
  startTimeControlName: string,
  endDateControlName: string,
  endTimeControlName: string
): ValidatorFn {
  return (fg: FormGroup) => {
    const startDate = fg.get(startDateControlName).value;
    const startTime = fg.get(startTimeControlName).value;
    const endDate = fg.get(endDateControlName).value;
    const endTime = fg.get(endTimeControlName).value;

    // Both dates should be set to trigger this validator, else it's not a range
    if (!startDate || !endDate) {
      return null;
    }

    const fullStartDate = new Date(startDate);
    const fullEndDate = new Date(endDate);

    // If we have times set (they can be optional), we must incorporate them into the date
    // The date values themselves should never already contain time info, see:
    // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#dates
    if (startTime && endTime) {
      // Time input values are strings of the format HH:mm:ss.sss, see:
      // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#times
      const splitStartTime = startTime.split(':');
      const splitEndTime = endTime.split(':');

      fullStartDate.setHours(+splitStartTime[0]);
      fullStartDate.setMinutes(+splitStartTime[1]);

      fullEndDate.setHours(+splitEndTime[0]);
      fullEndDate.setMinutes(+splitEndTime[1]);
    }

    return fullStartDate <= fullEndDate ? null : { dateTimeRange: true };
  };
}
