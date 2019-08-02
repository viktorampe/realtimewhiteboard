import { ClassGroupTypeInterface } from '../+models';

export class ClassGroupTypeFixture implements ClassGroupTypeInterface {
  // defaults
  name = 'normaal';
  id = 1;

  constructor(props: Partial<ClassGroupTypeInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
