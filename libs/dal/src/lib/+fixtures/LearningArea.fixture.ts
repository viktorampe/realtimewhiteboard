import { LearningAreaInterface } from '../+models';

export class LearningAreaFixture implements LearningAreaInterface {
  // defaults
  name: string = 'foo';
  icon: string = 'bar';
  color: string = '#f00';
  id: number = 1;

  constructor(props: Partial<LearningAreaInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
