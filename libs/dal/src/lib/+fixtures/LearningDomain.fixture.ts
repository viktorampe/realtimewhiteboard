import { LearningAreaInterface, LearningDomainInterface } from '../+models';

export class LearningDomainFixture implements LearningDomainInterface {
  // defaults
  name = 'metend lezen';
  id = 1;
  learningAreaId?: number;
  learningArea?: LearningAreaInterface;

  constructor(props: Partial<LearningDomainInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
