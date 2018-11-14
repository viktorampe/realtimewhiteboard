import { PersonInterface } from '../+models';

export class PersonFixture implements PersonInterface {
  // defaults
  firstName: string = 'foo';
  name: string = 'bar';
  displayName: 'foo bar';
  email: 'foo@bar.bar';
  id: number = 1;

  constructor(props: Partial<PersonInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
