import { LearningPlanAssignmentInterface } from '../+models';

export class LearningPlanAssignmentFixture
  implements LearningPlanAssignmentInterface {
  // defaults
  id = 1;
  subPlan = 'leerweg 123';
  learningPlanId = 1;
  schoolTypeId = 1;
  specialtyId = 1;
  yearId = 1;

  constructor(props: Partial<LearningPlanAssignmentInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
