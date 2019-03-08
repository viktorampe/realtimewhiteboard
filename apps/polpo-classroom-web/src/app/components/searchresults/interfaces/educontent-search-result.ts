import {
  BundleInterface,
  EduContentInterface,
  TaskInterface
} from '@campus/dal';

export interface EduContentSearchResultInterface {
  eduContent: EduContentInterface;
  inTask: boolean;
  currentTask: TaskInterface;
  inBundle: boolean;
  currentBundle: BundleInterface;
  isFavorite: boolean;
}
