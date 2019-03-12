import { SchoolTypeInterface } from '../+models';

export class SchoolTypeFixture implements SchoolTypeInterface {
  // defaults
  id = 1;
  name: 'foo';

  constructor(props: Partial<SchoolTypeInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
