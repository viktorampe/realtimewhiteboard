import { PersonInterface } from '../+models';

export class PersonFixture implements PersonInterface {
  name = 'Bakker';
  firstName = 'Manon';
  created = new Date('2018-09-04 14:21:14');
  email = 'student0@mailinator.com';
  currentSchoolYear = 2018;
  terms = true;
  username = 'student1';
  emailVerified = true;
  id = 6;
  displayName = 'Manon Bakker';

  constructor(props: Partial<PersonFixture> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
