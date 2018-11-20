import { TaskEduContentInterface } from '../+models';

export class TaskEduContentFixture implements TaskEduContentInterface {
  // defaults
  index: number = 1000;
  id?: number = 1;

  constructor(props: Partial<TaskEduContentInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
