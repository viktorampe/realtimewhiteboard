import {
  TaskStatusEnum,
  TaskWithAssigneesInterface
} from '../+state/task/TaskWithAssignees.interface';
import { AssigneeFixture } from './Assignee.fixture';

export class TaskWithAssigneesFixture implements TaskWithAssigneesInterface {
  name = 'FixtureOverhoring 1';
  status = TaskStatusEnum.PENDING;
  eduContentAmount = 0;
  assignees = [new AssigneeFixture()];
  learningAreaId = 4;
  taskEduContents = [];

  constructor(props: Partial<TaskWithAssigneesInterface> = {}) {
    Object.assign(this, props);
  }
}
