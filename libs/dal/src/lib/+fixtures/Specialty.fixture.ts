import { SpecialtyInterface } from '../+models';

export class SpecialtyFixture implements SpecialtyInterface {
  // defaults
  id = 1;
  name = 'foo';

  constructor(props: Partial<SpecialtyInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
