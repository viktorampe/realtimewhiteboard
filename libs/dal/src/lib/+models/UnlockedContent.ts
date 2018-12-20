import { ContentInterface, EduContent, UnlockedContentInterface } from '.';
import { BundleInterface } from './Bundle.interface';
import { GroupInterface } from './Group.interface';
import { PersonInterface } from './Person.interface';
import { StudentContentStatusInterface } from './StudentContentStatus.interface';
import { UnlockedContentGroupInterface } from './UnlockedContentGroup.interface';
import { UnlockedContentStudentInterface } from './UnlockedContentStudent.interface';
import { UserContent } from './UserContent';

export class UnlockedContent implements UnlockedContentInterface {
  index: number;
  exception?: boolean;
  id?: number;
  eduContentId?: number;
  teacherId?: number;
  bundleId?: number;
  userContentId?: number;
  eduContent?: EduContent;
  teacher?: PersonInterface;
  students?: PersonInterface[];
  unlockedContentStudent?: UnlockedContentStudentInterface[];
  groups?: GroupInterface[];
  unlockedContentGroup?: UnlockedContentGroupInterface[];
  studentContentStatuses?: StudentContentStatusInterface[];
  bundle?: BundleInterface;
  userContent?: UserContent;
  get content(): ContentInterface {
    return this.eduContent || this.userContent || null;
  }
}
