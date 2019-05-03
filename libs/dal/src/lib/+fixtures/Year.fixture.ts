import { YearInterface } from '../+models';

export class YearFixture implements YearInterface {
  // defaults
  id = 1;
  name: 'foo';
  label: '1e jaar';

  constructor(props: Partial<YearInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
