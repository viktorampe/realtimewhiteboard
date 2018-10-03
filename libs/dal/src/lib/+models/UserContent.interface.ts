import { PersonInterface } from './Person.interface';

export interface UserContentInterface {
  name: string;
  description: string;
  type: string;
  link?: string;
  id?: number;
  teacherId?: number;
  teacher?: PersonInterface;
}
