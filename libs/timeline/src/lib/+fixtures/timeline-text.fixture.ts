import { TimelineTextInterface } from '../interfaces/timeline';

export class TimelineTextFixture implements TimelineTextInterface {
  // defaults
  headline = 'foo';
  text = 'bar';

  constructor(props: Partial<TimelineTextInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
