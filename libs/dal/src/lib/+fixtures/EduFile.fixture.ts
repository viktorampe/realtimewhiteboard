import { EduFileInterface } from '../+models';

export class EduFileFixture implements EduFileInterface {
  // defaults
  id = 1;
  type = 'solution';

  constructor(props: Partial<EduFileInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
