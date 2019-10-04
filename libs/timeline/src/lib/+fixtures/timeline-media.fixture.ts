import { TimelineMedia } from '../interfaces/timeline';

export class TimelineMediaFixture implements TimelineMedia {
  // defaults
  url = 'foo.jpg';

  constructor(props: Partial<TimelineMedia> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
