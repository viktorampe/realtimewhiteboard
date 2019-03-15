import {
  LearningPlanAssignmentInterface,
  LearningPlanInterface
} from '../+models';

export class LearningPlanFixture implements LearningPlanInterface {
  // defaults
  name = 'foo';
  id = 1;
  code = 'bar';
  learningAreaId = 1;
  eduNetId = 1;
  assignments = [];

  constructor(
    props: Partial<LearningPlanInterface> = {},
    assignments: LearningPlanAssignmentInterface[] = []
  ) {
    // overwrite defaults
    Object.assign(this, props);
    this.assignments = assignments;
  }
}
