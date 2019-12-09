import {
  AssigneeInterface,
  AssigneeTypesEnum
} from '../+models/Assignee.interface';

export class AssigneeFixture implements AssigneeInterface {
  type = AssigneeTypesEnum.CLASSGROUP;
  label = 'foo';
  start = new Date();
  end = new Date();

  constructor(props: Partial<AssigneeInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
