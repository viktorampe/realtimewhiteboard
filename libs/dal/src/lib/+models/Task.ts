import { BundleInterface } from './Bundle.interface';
import { ContentInterface } from './Content.interface';
import { ContentCollectionInterface } from './ContentCollection.interface';
import { EduContent } from './EduContent';
import { EduContentInterface } from './EduContent.interface';
import { GroupInterface } from './Group.interface';
import { LearningAreaInterface } from './LearningArea.interface';
import { PersonInterface } from './Person.interface';
import { ResultInterface } from './Result.interface';
import { TaskInterface } from './Task.interface';
import { TaskEduContentInterface } from './TaskEduContent.interface';
import { TaskGroupInterface } from './TaskGroup.interface';
import { TaskInstanceInterface } from './TaskInstance.interface';
import { TaskStudentInterface } from './TaskStudent.interface';

export class Task implements TaskInterface, ContentCollectionInterface {
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
  results?: ResultInterface[];
  learningArea?: LearningAreaInterface;
  bundles?: BundleInterface[];
  taskInstances?: TaskInstanceInterface[];

  get contents(): ContentInterface[] {
    if (this.eduContents) {
      return this.eduContents.map(item =>
        Object.assign<EduContent, EduContentInterface>(new EduContent(), item)
      );
    }
  }
}
