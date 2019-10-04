import { TimelineConfig } from './../interfaces/timeline';
import { TimelineOptionsFixture } from './timeline-options.fixture';

export class TimelineConfigFixture implements TimelineConfig {
  // defaults
  events = [];
  eras = [];
  options = new TimelineOptionsFixture();

  constructor(props: Partial<TimelineConfig> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
