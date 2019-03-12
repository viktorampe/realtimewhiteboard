import { YearInterface } from '../+models';

export class YearFixture implements YearInterface {
  // defaults
  id = 1;
  name: 'foo';

  constructor(props: Partial<YearInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
