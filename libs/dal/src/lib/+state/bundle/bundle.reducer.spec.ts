import { Update } from '@ngrx/entity';
import { BundleActions } from '.';
import { BundleInterface } from '../../+models';
import { TeacherStudentActions } from '../teacher-student';
import { initialState, reducer, State } from './bundle.reducer';

const nameInitialValue = 'bert';
const nameUpdatedValue = 'pieter';

/**
 * Creates a Bundle.
 * @param {number} id
 * @returns {BundleInterface}
 */
function createBundle(
  id: number,
  name: any = nameInitialValue
): BundleInterface | any {
  return {
    id: id,
    name: name
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
  return state;
}

describe('Bundles Reducer', () => {
  let bundles: BundleInterface[];
  beforeEach(() => {
    bundles = [createBundle(1), createBundle(2), createBundle(3)];
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

    it('should add multiple bundles', () => {
      const action = new BundleActions.AddBundles({ bundles });
      const result = reducer(initialState, action);

      expect(result).toEqual(createState(bundles, false));
    });
  });
  describe('upsert actions', () => {
    it('should upsert one bundle', () => {
      const originalBundle = bundles[0];

      const startState = reducer(
        initialState,
        new BundleActions.AddBundle({
          bundle: originalBundle
        })
      );

      const updatedBundle = createBundle(bundles[0].id, 'test');

      const action = new BundleActions.UpsertBundle({
        bundle: updatedBundle
      });

      const result = reducer(startState, action);

      expect(result.entities[updatedBundle.id]).toEqual(updatedBundle);
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

      expect(result).toEqual(createState(bundlesToInsert));
    });
  });

  describe('update actions', () => {
    it('should update an bundle', () => {
      const bundle = bundles[0];
      const startState = createState([bundle]);
      const update: Update<BundleInterface> = {
        id: 1,
        changes: {
          name: nameUpdatedValue
        }
      };
      const action = new BundleActions.UpdateBundle({
        bundle: update
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([createBundle(1, nameUpdatedValue)]));
    });

    it('should update multiple bundles', () => {
      const startState = createState(bundles);
      const updates: Update<BundleInterface>[] = [
        {
          id: 1,
          changes: {
            name: nameUpdatedValue
          }
        },
        {
          id: 2,
          changes: {
            name: nameUpdatedValue
          }
        }
      ];
      const action = new BundleActions.UpdateBundles({
        bundles: updates
      });
      const result = reducer(startState, action);

      expect(result).toEqual(
        createState([
          createBundle(1, nameUpdatedValue),
          createBundle(2, nameUpdatedValue),
          bundles[2]
        ])
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

  describe('invalidate action', () => {
    it('should trigger from LinkTeacherStudent', () => {
      const startState = createState(bundles, true);
      const action = new TeacherStudentActions.LinkTeacherStudent({
        publicKey: 'foo',
        userId: 1,
        customFeedbackHandlers: { useCustomErrorHandler: true }
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState(bundles, false));
    });

    it('should trigger from UnlinkTeacherStudent', () => {
      const startState = createState(bundles, true);
      const action = new TeacherStudentActions.UnlinkTeacherStudent({
        teacherId: 1,
        userId: 1
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState(bundles, false));
    });
  });
});
