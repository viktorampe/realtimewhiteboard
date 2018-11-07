import {
  BundleInterface,
  ContentInterface,
  LearningAreaInterface
} from '@campus/dal';

export interface LearningAreaInfoInterface {
  learningArea: LearningAreaInterface;
  bundleCount: number;
  bookCount: number;
}

export interface LearningAreasWithBundlesInfoInterface {
  learningAreas: LearningAreaInfoInterface[];
}

export interface BundleInfoInterface {
  bundle: BundleInterface;
  contentsCount: number;
}

export interface BundlesWithContentInfoInterface {
  bundles: BundleInfoInterface[];
  books: ContentInterface[];
}
