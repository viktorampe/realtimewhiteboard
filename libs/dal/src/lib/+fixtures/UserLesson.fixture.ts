import { UserLessonInterface } from '../+models';

export class UserLessonFixture implements UserLessonInterface {
  id = 1;
  description = 'foo bar';
  learningPlanGoalProgress = [];

  constructor(props: Partial<UserLessonInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
