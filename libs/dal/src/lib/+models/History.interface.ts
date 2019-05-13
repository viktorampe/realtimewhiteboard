import { BundleInterface } from './Bundle.interface';
import { EduContentInterface } from './EduContent.interface';
import { LearningAreaInterface } from './LearningArea.interface';
import { PersonInterface } from './Person.interface';
import { TaskInterface } from './Task.interface';

export interface HistoryInterface {
  type: string;
  name?: string;
  criteria?: string;
  created: Date;
  id?: number;
  personId?: number;
  learningAreaId?: number;
  eduContentId?: number;
  bundleId?: number;
  taskId?: number;
  person?: PersonInterface;
  learningArea?: LearningAreaInterface;
  eduContent?: EduContentInterface;
  bundle?: BundleInterface;
  task?: TaskInterface;
}
