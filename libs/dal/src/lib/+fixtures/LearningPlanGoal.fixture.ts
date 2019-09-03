import { LearningPlanGoalInterface } from '../+models';

export class LearningPlanGoalFixture implements LearningPlanGoalInterface {
  // defaults
  goal = 'kunnen tellen';
  uniqueIdentifier = '3e1b7737-28d8-446c-85fe-5ca7ccd0bed1';
  prefix = 'ET WIS 1.1';
  type = 'foo';
  id = 1;
  learningAreaId = 1;
  learningDomainId? = 1;
  eduNetId = 1;

  constructor(props: Partial<LearningPlanGoalInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
