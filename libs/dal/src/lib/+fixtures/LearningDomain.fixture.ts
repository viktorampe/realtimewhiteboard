import { LearningDomainInterface } from '../+models';

export class LearningDomainFixture implements LearningDomainInterface {
  // defaults
  name = 'metend lezen';
  id = 1;

  constructor(props: Partial<LearningDomainInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
