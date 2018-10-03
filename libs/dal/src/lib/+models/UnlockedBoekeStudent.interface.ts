import { EduContentInterface } from './EduContent.interface';
import { PersonInterface } from './Person.interface';

export interface UnlockedBoekeStudentInterface {
  id?: number;
  eduContentId?: number;
  studentId?: number;
  teacherId?: number;
  eduContent?: EduContentInterface;
  student?: PersonInterface;
  teacher?: PersonInterface;
}
