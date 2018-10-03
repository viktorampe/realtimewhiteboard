import { GroupInterface } from './Group.interface';

export interface SSClassGroupStudentInterface {
  batchIdentifier: string;
  classIdentifier: string;
  userIdentifier: string;
  id?: number;
  group?: GroupInterface;
}
