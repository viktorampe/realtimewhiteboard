import { PersonInterface } from '../+models';

export class PersonFixture implements PersonInterface {
  // defaults
  firstName = 'foo';
  name = 'bar';
  displayName = 'foo bar';
  email = 'foo@bar.bar';
  id = 1;
  roles = [];

  constructor(props: Partial<PersonInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
