import { TimelineConfigInterface } from './../interfaces/timeline';
import { TimelineOptionsFixture } from './timeline-options.fixture';

export class TimelineConfigFixture implements TimelineConfigInterface {
  // defaults
  events = [];
  eras = [];
  options = new TimelineOptionsFixture();

  constructor(props: Partial<TimelineConfigInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
