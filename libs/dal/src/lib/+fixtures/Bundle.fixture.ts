import { BundleInterface } from '../+models';

export class BundleFixture implements BundleInterface {
  // defaults
  name = 'foo';
  description = 'foo bar';
  start = new Date();
  end = new Date();
  id = 1;
  teacherId = 1;
  learningAreaId = 1;

  constructor(props: Partial<BundleInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
