import { TimelineBackgroundInterface } from '../interfaces/timeline';

export class TimelineBackgroundFixture implements TimelineBackgroundInterface {
  // defaults
  color = '#ffe4e1';

  constructor(props: Partial<TimelineBackgroundInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
