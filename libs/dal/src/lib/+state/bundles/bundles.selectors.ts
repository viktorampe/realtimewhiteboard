import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BundlesState } from './bundles.reducer';

// Lookup the 'Bundles' feature state managed by NgRx
const getBundlesState = createFeatureSelector<BundlesState>('bundles');

const getLoaded = createSelector(
  getBundlesState,
  (state: BundlesState) => state.loaded
);
const getError = createSelector(
  getBundlesState,
  (state: BundlesState) => state.error
);

const getAllBundles = createSelector(
  getBundlesState,
  getLoaded,
  (state: BundlesState, isLoaded) => {
    return isLoaded ? state.list : [];
  }
);
const getSelectedId = createSelector(
  getBundlesState,
  (state: BundlesState) => state.selectedId
);
const getSelectedBundles = createSelector(
  getAllBundles,
  getSelectedId,
  (bundles, id) => {
    const result = bundles.find(it => it['id'] === id);
    return result ? Object.assign({}, result) : undefined;
  }
);

export const bundlesQuery = {
  getLoaded,
  getError,
  getAllBundles,
  getSelectedBundles
};
