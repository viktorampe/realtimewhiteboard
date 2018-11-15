import { BundleInterface } from '../+models';

export class BundleFixture implements BundleInterface {
  // defaults
  name: string = 'foo';
  description: string = 'foo bar';
  start: Date = new Date();
  end: Date = new Date();
  id: number = 1;
  teacherId: number = 1;
  learningAreaId: number = 1;

  constructor(props: Partial<BundleInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
