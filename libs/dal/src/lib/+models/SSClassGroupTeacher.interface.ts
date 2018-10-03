import { GroupInterface } from './Group.interface';

export interface SSClassGroupTeacherInterface {
  batchIdentifier: string;
  classIdentifier: string;
  userIdentifier: string;
  id?: number;
  group?: GroupInterface;
}
