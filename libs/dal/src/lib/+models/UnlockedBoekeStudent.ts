import { EduContentInterface } from './EduContent.interface';
import { PersonInterface } from './Person.interface';
import { UnlockedBoekeStudentInterface } from './UnlockedBoekeStudent.interface';

export class UnlockedBoekeStudent implements UnlockedBoekeStudentInterface {
  id?: number;
  eduContentId?: number;
  studentId: number;
  teacherId?: number;
  eduContent?: EduContentInterface;
  student?: PersonInterface;
  teacher?: PersonInterface;

  isOwn(userId: number): boolean {
    return this.teacherId === userId;
  }
}
