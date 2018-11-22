import {
  BundleInterface,
  EduContentInterface,
  GroupInterface,
  LearningAreaInterface,
  PersonInterface,
  ResultInterface,
  TaskEduContentInterface,
  TaskGroupInterface,
  TaskInstanceInterface,
  TaskInterface,
  TaskStudentInterface
} from '../+models';
import { PersonFixture } from './Person.fixture';

export class TaskFixture implements TaskInterface {
  name = 'task name';
  description? = 'task description';
  archivedAt? = new Date();
  archivedYear? = new Date().getFullYear();
  id? = 0;
  personId? = new PersonFixture().id;
  teacher?: PersonInterface = new PersonFixture();
  learningAreaId?: number;
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

  constructor(props: Partial<TaskFixture> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
