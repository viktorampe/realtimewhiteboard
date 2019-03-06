import { BundleInterface } from './Bundle.interface';
import { EduContentInterface } from './EduContent.interface';
import { LearningAreaInterface } from './LearningArea.interface';
import { PersonInterface } from './Person.interface';
import { TaskInterface } from './Task.interface';

export enum FavoriteTypesEnum {
  area = 'area',
  search = 'search',
  educontent = 'educontent',
  bundle = 'bundle',
  task = 'task',
  boeke = 'boek-e'
}

export interface FavoriteInterface {
  type: FavoriteTypesEnum;
  name?: string;
  criteria?: any;
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
