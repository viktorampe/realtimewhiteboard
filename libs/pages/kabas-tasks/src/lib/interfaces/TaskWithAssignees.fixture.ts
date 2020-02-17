import { AssigneeFixture } from './Assignee.fixture';
import {
  TaskStatusEnum,
  TaskWithAssigneesInterface
} from './TaskWithAssignees.interface';

export class TaskWithAssigneesFixture implements TaskWithAssigneesInterface {
  name = 'FixtureOverhoring 1';
  status = TaskStatusEnum.PENDING;
  eduContentAmount = 0;
  assignees = [new AssigneeFixture()];
  learningAreaId = 4;

  constructor(props: Partial<TaskWithAssigneesInterface> = {}) {
    Object.assign(this, props);
  }
}
