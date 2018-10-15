import { createSelector } from '@ngrx/store';
import { BundleInterface } from '../+models';
import { BundleQueries, BundleReducer } from './bundle';

export const getLearningAreaBundles = createSelector(
  BundleQueries.selectBundleState,
  BundleQueries.getAll,
  (
    state: BundleReducer.State,
    bundles: BundleInterface[],
    props: { learingAreaId: number }
  ) => {
    return bundles.filter(
      bundle => bundle.learningAreaId === props.learingAreaId
    );
  }
);
