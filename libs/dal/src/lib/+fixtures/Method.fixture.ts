import { MethodInterface } from '../+models';

export class MethodFixture implements MethodInterface {
  // defaults
  id = 1;
  name = 'Katapult';
  learningAreaId = 19;

  constructor(props: Partial<MethodFixture> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
