import { TimelineBackground } from '../interfaces/timeline';

export class TimelineBackgroundFixture implements TimelineBackground {
  // defaults
  color = '#ffe4e1';

  constructor(props: Partial<TimelineBackground> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
