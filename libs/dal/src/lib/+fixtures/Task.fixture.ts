import { TaskInterface } from '../+models';

export class TaskFixture implements TaskInterface {
  // defaults
  name: string = 'foo';
  id: number = 1;
  description: string = 'Lorem ipsum etcetera';
  archivedAt: Date = new Date(2018, 11 - 1, 20);
  archivedYear: number = 2018;

  constructor(props: Partial<TaskInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
