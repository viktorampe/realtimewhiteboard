import { TimelineSlide } from './../interfaces/timeline';
import { TimelineBackgroundFixture } from './timeline-background.fixture';
import { TimelineDateFixture } from './timeline-data.fixture';
import { TimelineTextFixture } from './timeline-text.fixture';

export class TimelineSlideFixture implements TimelineSlide {
  // defaults
  start_date = new TimelineDateFixture();
  end_date = new TimelineDateFixture();
  text = new TimelineTextFixture();
  background = new TimelineBackgroundFixture();

  constructor(props: Partial<TimelineSlide> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
