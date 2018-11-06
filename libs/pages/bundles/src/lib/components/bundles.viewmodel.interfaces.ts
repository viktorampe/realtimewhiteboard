import {
  BundleInterface,
  ContentInterface,
  LearningAreaInterface
} from '@campus/dal';

export interface LearningAreasWithBundlesInfoInterface {
  learningAreas: {
    learningArea: LearningAreaInterface;
    bundleCount: number;
    bookCount: number;
  }[];
}

export interface BundlesWithContentInfoInterface {
  bundles: {
    bundle: BundleInterface;
    contentsCount: number;
  }[];
  books: ContentInterface[];
}
