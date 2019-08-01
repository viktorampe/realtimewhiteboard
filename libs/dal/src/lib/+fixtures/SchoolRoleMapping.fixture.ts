import { SchoolRoleMappingInterface } from '../+models';

export class SchoolRoleMappingFixture implements SchoolRoleMappingInterface {
  // defaults
  id = 1;
  personId = 1;
  roleId = 1;
  schoolId = 1;
  classGroups = [];

  constructor(props: Partial<SchoolRoleMappingInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
