import { PersonInterface } from './Person.interface';

export interface TeacherStudentInterface {
  created: Date;
  id?: number;
  teacherId?: number;
  studentId?: number;
  smartschoolTeacherId?: string;
  smartschoolStudentId?: string;
  synced?: boolean;
  teacher?: PersonInterface;
  student?: PersonInterface;
}
