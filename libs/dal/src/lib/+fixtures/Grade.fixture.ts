import { GradeInterface } from '../+models';

export class GradeFixture implements GradeInterface {
  name = 'foo';

  constructor(props: Partial<GradeInterface> = {}) {
    Object.assign(this, props);
  }
}
