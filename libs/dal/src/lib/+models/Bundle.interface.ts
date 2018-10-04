import { EduContentInterface } from './EduContent.interface';
import { GroupInterface } from './Group.interface';
import { LearningAreaInterface } from './LearningArea.interface';
import { PersonInterface } from './Person.interface';
import { TaskInterface } from './Task.interface';
import { UnlockedContentInterface } from './UnlockedContent.interface';

export interface BundleInterface {
  name: string;
  description?: string;
  start: Date;
  end: Date;
  id?: number;
  teacherId?: number;
  learningAreaId?: number;
  tasks?: TaskInterface[];
  unlockedContents?: UnlockedContentInterface[];
  eduContents?: EduContentInterface[];
  teacher?: PersonInterface;
  learningArea?: LearningAreaInterface;
  groups?: GroupInterface[];
  students?: PersonInterface[];
}
