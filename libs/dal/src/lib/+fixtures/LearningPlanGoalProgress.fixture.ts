import { LearningPlanGoalProgressInterface } from '../+models';

export class LearningPlanGoalProgressFixture
  implements LearningPlanGoalProgressInterface {
  // defaults
  originalClassGroup = '1A';
  schoolYear = 1;
  id = 1;
  personId = 1;
  classGroupId = 1;
  eduContentTOCId = 1;
  learningPlanGoalId = 1;
  userLessonId = 1;

  constructor(props: Partial<LearningPlanGoalProgressInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
