import { TimelineOptions } from '../interfaces/timeline';

export class TimelineOptionsFixture implements TimelineOptions {
  // defaults

  constructor(props: Partial<TimelineOptions> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
