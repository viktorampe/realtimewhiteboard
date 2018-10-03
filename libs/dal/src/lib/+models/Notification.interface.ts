import { PersonInterface } from './Person.interface';

export interface NotificationInterface {
  id?: number;
  personId?: number;
  person?: PersonInterface;
}
