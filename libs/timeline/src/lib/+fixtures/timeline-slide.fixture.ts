import { TimelineSlideInterface } from './../interfaces/timeline';
import { TimelineBackgroundFixture } from './timeline-background.fixture';
import { TimelineDateFixture } from './timeline-date.fixture';
import { TimelineTextFixture } from './timeline-text.fixture';

export class TimelineSlideFixture implements TimelineSlideInterface {
  // defaults
  start_date = new TimelineDateFixture();
  end_date = new TimelineDateFixture();
  text = new TimelineTextFixture();
  background = new TimelineBackgroundFixture();

  constructor(props: Partial<TimelineSlideInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
