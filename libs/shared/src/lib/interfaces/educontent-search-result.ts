import {
  BundleInterface,
  EduContent,
  MethodLevelInterface,
  Result,
  TaskInterface
} from '@campus/dal';

export interface EduContentSearchResultInterface {
  eduContent: EduContent;
  inTask?: boolean;
  currentTask?: TaskInterface;
  inBundle?: boolean;
  currentBundle?: BundleInterface;
  isFavorite?: boolean;
  methodLevel?: MethodLevelInterface;
  result?: Result;
}
