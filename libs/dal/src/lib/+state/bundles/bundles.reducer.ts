import { BundlesAction, BundlesActionTypes } from './bundles.actions';

/**
 * Interface for the 'Bundles' data used in
 *  - BundlesState, and
 *  - bundlesReducer
 *
 *  Note: replace if already defined in another module
 */

/* tslint:disable:no-empty-interface */
export interface Entity {}

export interface BundlesState {
  list: Entity[]; // list of Bundles; analogous to a sql normalized table
  selectedId?: string | number; // which Bundles record has been selected
  loaded: boolean; // has the Bundles list been loaded
  error?: any; // last none error (if any)
}

export const initialState: BundlesState = {
  list: [],
  loaded: false
};

export function bundlesReducer(
  state: BundlesState = initialState,
  action: BundlesAction
): BundlesState {
  switch (action.type) {
    case BundlesActionTypes.BundlesLoaded: {
      state = {
        ...state,
        list: action.payload,
        loaded: true
      };
      break;
    }
  }
  return state;
}
