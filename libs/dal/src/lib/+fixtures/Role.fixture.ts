import { RoleInterface } from './../+models/Role.interface';

export class RoleFixture implements RoleInterface {
  // defaults
  id = 1;
  name = 'student';
  description = '';
  created = new Date();
  modified = new Date();
  ink = false;
  principals = [];

  constructor(props: Partial<RoleInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
