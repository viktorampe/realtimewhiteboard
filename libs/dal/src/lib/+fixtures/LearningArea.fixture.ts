import { LearningAreaInterface } from '../+models';

export class LearningAreaFixture implements LearningAreaInterface {
  // defaults
  name = 'foo';
  icon = 'bar';
  color = '#f00';
  id = 1;

  constructor(props: Partial<LearningAreaInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
