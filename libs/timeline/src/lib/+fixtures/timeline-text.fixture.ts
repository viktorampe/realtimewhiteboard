import { TimelineText } from '../interfaces/timeline';

export class TimelineTextFixture implements TimelineText {
  // defaults
  headline = 'foo';
  text = 'bar';

  constructor(props: Partial<TimelineText> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
