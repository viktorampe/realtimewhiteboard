import { GroupInterface } from '../+models';

export class GroupFixture implements GroupInterface {
  id = 1;
  name = 'Remediëring 2c';
  teacherId = 1;
  schoolAddressId = 1;

  constructor(props: Partial<GroupInterface> = {}) {
    Object.assign(this, props);
  }
}
