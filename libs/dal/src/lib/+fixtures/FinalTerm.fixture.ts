import { FinalTermInterface } from '../+models';

export class FinalTermFixture implements FinalTermInterface {
  goal = 'kunnen tellen.';
  uniqueIdentifier = '3e1b7737-28d8-446c-85fe-5ca7ccd0bed1';
  prefix = 'ET WIS 1.1';
  id = 1;
  learningAreaId = 1;
  learningDomainId = 1;
  methodGoals = [];

  constructor(props: Partial<FinalTermInterface> = {}) {
    Object.assign(this, props);
  }
}
