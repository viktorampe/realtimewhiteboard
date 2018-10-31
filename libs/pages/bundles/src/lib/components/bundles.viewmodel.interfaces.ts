import {
  BundleInterface,
  ContentInterface,
  LearningAreaInterface
} from '@campus/dal';

export interface LearningAreasWithBundlesInfo {
  learningAreas: {
    learningArea: LearningAreaInterface;
    bundleCount: number;
    bookCount: number;
  }[];
}

export interface BundlesWithContentInfo {
  bundles: {
    bundle: BundleInterface;
    contentsCount: number;
  }[];
  books: ContentInterface[];
}
