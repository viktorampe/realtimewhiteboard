import { PersonInterface } from './Person.interface';
import { UnlockedContentInterface } from './UnlockedContent.interface';

export interface UnlockedContentStudentInterface {
  start?: Date;
  end?: Date;
  id?: number;
  teacherId?: number;
  personId?: number;
  unlockedContentId?: number;
  teacher?: PersonInterface;
  student?: PersonInterface;
  unlockedContent?: UnlockedContentInterface;
}
