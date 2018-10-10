import { Update } from '@ngrx/entity';
import {BundleActions } from '.';
import { initialState, reducer, State } from './bundle.reducer';
import { BundleInterface } from '../../+models';

/** 
 * This file is scaffolded, but needs some special attention:
 * - find and replace '__EXTRA__PROPERTY_NAME' and replace this with a property name of the Bundle entity.
 * - set the initial property value via '[__EXTRA__PROPERTY_NAME]InitialValue'.
 * - set the updated property value via '[__EXTRA__PROPERTY_NAME]UpdatedValue'.
 * - if a none-default sortComparer function is used, assign it to the 'sortComparer' property.
*/
const __EXTRA__PROPERTY_NAMEInitialValue = '';
const __EXTRA__PROPERTY_NAMEUpdatedValue = '';
const sortComparer: any = undefined;

/**
 * Creates a Bundle.
 * @param {number} id
 * @returns {BundleInterface}
 */
function createBundle(id: number, __EXTRA__PROPERTY_NAME:any = __EXTRA__PROPERTY_NAMEInitialValue): BundleInterface | any {
  return {
    id: id,
    __EXTRA__PROPERTY_NAME: __EXTRA__PROPERTY_NAME
  };
}

/**
 * Utility to create the bundle state.
 *
 * @param {BundleInterface[]} bundles
 * @param {boolean} [loaded]
 * @param {*} [error]
 * @returns {State}
 */
function createState(
  bundles: BundleInterface[],
  loaded: boolean = false,
  error?: any
): State {
  const state: any = {
    ids: bundles ? bundles.map(bundle => bundle.id) : [],
    entities: bundles
      ? bundles.reduce(
          (entityMap, bundle) => ({
            ...entityMap,
            [bundle.id]: bundle
          }),
          {}
        )
      : {},
    loaded: loaded
  };
  if (error !== undefined) state.error = error;
  if (sortComparer && bundles) state.ids = state.ids.sort(sortComparer);
  return state;
}


describe('Bundles Reducer', () => {
  let bundles: BundleInterface[];
  beforeEach(() => {
    bundles = [
      createBundle(1),
      createBundle(2),
      createBundle(3)
    ];
  });

  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });

  describe('loaded action', () => {
    it('should load all bundles', () => {
      const action = new BundleActions.BundlesLoaded({ bundles });
      const result = reducer(initialState, action);
      expect(result).toEqual(createState(bundles, true));
    });

    it('should error', () => {
      const error = 'Something went wrong';
      const action = new BundleActions.BundlesLoadError(error);
      const result = reducer(initialState, action);
      expect(result).toEqual(createState([], false, error));
    });
  });

  describe('add actions', () => {
    it('should add one bundle', () => {
      const bundle = bundles[0];
      const action = new BundleActions.AddBundle({
        bundle
      });

      const result = reducer(initialState, action);
      expect(result).toEqual(createState([bundle], false));
    });

    it('should add mulitple bundles', () => {
      const action = new BundleActions.AddBundles({ bundles });
      const result = reducer(initialState, action);

      expect(result).toEqual(createState(bundles, false));
    });
  });
  describe('upsert actions', () => {
    it('should upsert one bundle', () => {
      const originalBundle = bundles[0];
      
      reducer(
        initialState,
        new BundleActions.AddBundle({
          bundle: originalBundle
        })
      );

    
      const updatedBundle = createBundle(1);
     
      const action = new BundleActions.UpsertBundle({
        bundle: updatedBundle
      });

      const result = reducer(initialState, action);

      expect(result.entities[updatedBundle.id]).toBe(updatedBundle);
    });

    it('should upsert many bundles', () => {
      const startState = createState(bundles);

      const bundlesToInsert = [
        createBundle(1),
        createBundle(2),
        createBundle(3),
        createBundle(4)
      ];
      const action = new BundleActions.UpsertBundles({
        bundles: bundlesToInsert
      });

      const result = reducer(startState, action);

      expect(result).toEqual(
        createState(bundlesToInsert)
      );
    });
  });

  describe('update actions', () => {
    it('should update an bundle', () => {
      const bundle = bundles[0];
      const startState = createState([bundle]);
      const update: Update<BundleInterface> = {
        id: 1,
        changes: {
          __EXTRA__PROPERTY_NAME: __EXTRA__PROPERTY_NAMEUpdatedValue
        } 
      };
      const action = new BundleActions.UpdateBundle({
        bundle: update
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([createBundle(1, __EXTRA__PROPERTY_NAMEUpdatedValue)]));
    });

    it('should update multiple bundles', () => {
      const startState = createState(bundles);
      const updates: Update<BundleInterface>[] = [
        
        {
          id: 1,
          changes: {
            __EXTRA__PROPERTY_NAME: __EXTRA__PROPERTY_NAMEUpdatedValue
          } 
        },
        {
          id: 2,
          changes: {
            __EXTRA__PROPERTY_NAME: __EXTRA__PROPERTY_NAMEUpdatedValue
          }  
        }
      ];
      const action = new BundleActions.UpdateBundles({
        bundles: updates
      });
      const result = reducer(startState, action);

      expect(result).toEqual(
        createState([createBundle(1, __EXTRA__PROPERTY_NAMEUpdatedValue), createBundle(2, __EXTRA__PROPERTY_NAMEUpdatedValue), bundles[2]])
      );
    });
  });

  describe('delete actions', () => {
    it('should delete one bundle ', () => {
      const bundle = bundles[0];
      const startState = createState([bundle]);
      const action = new BundleActions.DeleteBundle({
        id: bundle.id
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([]));
    });

    it('should delete multiple bundles', () => {
      const startState = createState(bundles);
      const action = new BundleActions.DeleteBundles({
        ids: [bundles[0].id, bundles[1].id]
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([bundles[2]]));
    });
  });

  describe('clear action', () => {
    it('should clear the bundles collection', () => {
      const startState = createState(bundles, true, 'something went wrong');
      const action = new BundleActions.ClearBundles();
      const result = reducer(startState, action);
      expect(result).toEqual(createState([], true, 'something went wrong'));
    });
  });
});
