import { PersonInterface } from './Person.interface';

export interface TeacherInfoInterface {
  publicKey: string;
  id?: number;
  teacherId?: number;
  teacher?: PersonInterface;
}
