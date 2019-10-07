import { TimelineEraInterface } from '../interfaces/timeline';
import { TimelineDateFixture } from './timeline-date.fixture';
import { TimelineTextFixture } from './timeline-text.fixture';
export class TimelineEraFixture implements TimelineEraInterface {
  // defaults
  start_date = new TimelineDateFixture();
  end_date = new TimelineDateFixture();
  text = new TimelineTextFixture();

  constructor(props: Partial<TimelineEraInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
