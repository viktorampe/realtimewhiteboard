import { TaskInterface } from '../+models';

export class TaskFixture implements TaskInterface {
  // defaults
  name = 'foo';
  id = 1;
  description = 'Lorem ipsum etcetera';
  archivedAt = new Date(2018, 11 - 1, 20);
  archivedYear = 2018;
  learningAreaId = 1;

  constructor(props: Partial<TaskInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
