import { ClassGroupInterface } from '../+models';

export class ClassGroupFixture implements ClassGroupInterface {
  // defaults
  name = '1A';
  id = 1;
  schoolId = 1;
  classGroupTypeId = 1;

  constructor(props: Partial<ClassGroupInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
