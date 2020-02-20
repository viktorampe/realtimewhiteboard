import { AssigneeTypesEnum } from '@campus/dal';
import { AssigneeInterface } from './Assignee.interface';

export class AssigneeFixture implements AssigneeInterface {
  type = AssigneeTypesEnum.CLASSGROUP;
  id = 1;
  label = 'foo';
  start = new Date();
  end = new Date();
  relationId = 1;

  constructor(props: Partial<AssigneeInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
