import { TimelineMediaInterface } from '../interfaces/timeline';

export class TimelineMediaFixture implements TimelineMediaInterface {
  // defaults
  url = 'foo.jpg';

  constructor(props: Partial<TimelineMediaInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
