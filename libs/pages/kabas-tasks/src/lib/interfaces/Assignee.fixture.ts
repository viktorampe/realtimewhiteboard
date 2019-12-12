import { AssigneeInterface, AssigneeTypesEnum } from './Assignee.interface';

export class AssigneeFixture implements AssigneeInterface {
  type = AssigneeTypesEnum.CLASSGROUP;
  id = 1;
  label = 'foo';
  start = new Date();
  end = new Date();
  id = 1;

  constructor(props: Partial<AssigneeInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
