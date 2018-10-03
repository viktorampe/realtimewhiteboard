import { BundleInterface } from './Bundle.interface';
import { EduContentInterface } from './EduContent.interface';
import { GroupInterface } from './Group.interface';
import { PersonInterface } from './Person.interface';
import { StudentContentStatusInterface } from './StudentContentStatus.interface';
import { UnlockedContentGroupInterface } from './UnlockedContentGroup.interface';
import { UnlockedContentStudentInterface } from './UnlockedContentStudent.interface';
import { UserContentInterface } from './UserContent.interface';

export interface UnlockedContentInterface {
  index: number;
  exception?: boolean;
  id?: number;
  eduContentId?: number;
  teacherId?: number;
  bundleId?: number;
  userContentId?: number;
  eduContent?: EduContentInterface;
  teacher?: PersonInterface;
  students?: PersonInterface[];
  unlockedContentStudent?: UnlockedContentStudentInterface[];
  groups?: GroupInterface[];
  unlockedContentGroup?: UnlockedContentGroupInterface[];
  studentContentStatuses?: StudentContentStatusInterface[];
  bundle?: BundleInterface;
  userContent?: UserContentInterface;
}
