import { TimelineDateInterface } from './../interfaces/timeline';

export class TimelineDateFixture implements TimelineDateInterface {
  // defaults
  year = 2019;
  month = 2; // Note: 1 is January, not 0
  day = 14;
  display_date = 'valentijn';

  constructor(props: Partial<TimelineDateInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
