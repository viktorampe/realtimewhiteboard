import { BundleInterface } from './Bundle.interface';
import { ClassGroupInterface } from './ClassGroup.interface';
import { EduContentInterface } from './EduContent.interface';
import { GroupInterface } from './Group.interface';
import { LearningAreaInterface } from './LearningArea.interface';
import { PersonInterface } from './Person.interface';
import { ResultInterface } from './Result.interface';
import { TaskClassGroupInterface } from './TaskClassGroup.interface';
import { TaskEduContentInterface } from './TaskEduContent.interface';
import { TaskGroupInterface } from './TaskGroup.interface';
import { TaskInstanceInterface } from './TaskInstance.interface';
import { TaskStudentInterface } from './TaskStudent.interface';

export interface TaskInterface {
  name: string;
  description?: string;
  archivedAt?: Date;
  archivedYear?: number;
  id?: number;
  personId?: number;
  learningAreaId?: number;
  teacher?: PersonInterface;
  groups?: GroupInterface[];
  taskGroups?: TaskGroupInterface[];
  students?: PersonInterface[];
  taskStudents?: TaskStudentInterface[];
  eduContents?: EduContentInterface[];
  taskEduContents?: TaskEduContentInterface[];
  classGroups?: ClassGroupInterface[];
  taskClassGroups?: TaskClassGroupInterface[];
  results?: ResultInterface[];
  learningArea?: LearningAreaInterface;
  bundles?: BundleInterface[];
  taskInstances?: TaskInstanceInterface[];
  isPaperTask?: boolean;
  isFavorite?: boolean;
  archived?: boolean;
}
