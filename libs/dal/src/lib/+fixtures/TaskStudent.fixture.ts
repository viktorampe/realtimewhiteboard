import { TaskStudentInterface } from '../+models';

export class TaskStudentFixture implements TaskStudentInterface {
  start = new Date();
  end = new Date();
  instantiated = false;
  id = 1;
  taskId = 1;
  personId = 1;

  constructor(props: Partial<TaskStudentInterface> = {}) {
    Object.assign(this, props);
  }
}
