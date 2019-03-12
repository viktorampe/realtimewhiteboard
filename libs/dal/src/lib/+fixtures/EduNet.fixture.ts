import { EduNetInterface } from '../+models';

export class EduNetFixture implements EduNetInterface {
  // defaults
  id = 1;
  name: 'foo';
  code: 'bar';

  constructor(props: Partial<EduNetInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
