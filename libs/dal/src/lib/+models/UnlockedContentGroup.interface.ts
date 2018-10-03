import { GroupInterface } from './Group.interface';
import { UnlockedContentInterface } from './UnlockedContent.interface';

export interface UnlockedContentGroupInterface {
  start?: Date;
  end?: Date;
  id?: number;
  groupId?: number;
  unlockedContentId?: number;
  teacherId?: number;
  group?: GroupInterface;
  unlockedContent?: UnlockedContentInterface;
}
