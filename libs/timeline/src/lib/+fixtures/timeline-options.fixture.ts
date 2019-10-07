import { TimelineOptionsInterface } from '../interfaces/timeline';

export class TimelineOptionsFixture implements TimelineOptionsInterface {
  // defaults

  constructor(props: Partial<TimelineOptionsInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
