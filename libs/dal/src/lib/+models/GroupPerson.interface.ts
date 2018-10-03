import { GroupInterface } from './Group.interface';
import { PersonInterface } from './Person.interface';

export interface GroupPersonInterface {
  id?: number;
  groupId?: number;
  personId?: number;
  group?: GroupInterface;
  person?: PersonInterface;
}
