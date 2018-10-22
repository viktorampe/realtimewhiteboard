import { EduContentInterface } from './EduContent.interface';
import { GroupInterface } from './Group.interface';
import { PersonInterface } from './Person.interface';

export interface UnlockedBoekeGroupInterface {
  id?: number;
  eduContentId?: number;
  groupId: number;
  teacherId?: number;
  eduContent?: EduContentInterface;
  group?: GroupInterface;
  teacher?: PersonInterface;

  isOwn(userId: number): boolean;
}
