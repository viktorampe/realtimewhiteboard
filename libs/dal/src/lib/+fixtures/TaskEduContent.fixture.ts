import { TaskEduContentInterface } from '../+models';

export class TaskEduContentFixture implements TaskEduContentInterface {
  // defaults
  index = 1000;
  id = 1;

  constructor(props: Partial<TaskEduContentInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
