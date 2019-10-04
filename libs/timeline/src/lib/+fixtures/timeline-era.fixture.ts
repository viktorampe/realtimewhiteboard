import { TimelineSlide } from './../interfaces/timeline';
import { TimelineBackgroundFixture } from './timeline-background.fixture';
import { TimelineDateFixture } from './timeline-data.fixture';
import { TimelineTextFixture } from './timeline-text.fixture';

export class TimelineEraFixture implements TimelineEra {
  // defaults
  start_date = new TimelineDateFixture();
  end_date = new TimelineDateFixture();
  text = new TimelineTextFixture();

  constructor(props: Partial<TimelineEra> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
