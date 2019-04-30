import { BundleInterface, EduContent, TaskInterface } from '@campus/dal';

export interface EduContentSearchResultInterface {
  eduContent: EduContent;
  inTask: boolean;
  currentTask: TaskInterface;
  inBundle: boolean;
  currentBundle: BundleInterface;
  isFavorite: boolean;
}
