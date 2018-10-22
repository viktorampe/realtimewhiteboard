import { BundleQueries } from '.';
import { BundleInterface } from '../../+models';
import { State } from './bundle.reducer';

describe('Bundle Selectors', () => {
  function createBundle(id: number): BundleInterface | any {
    return {
      id: id,
      learningAreaId: Math.round(id / 2),
      teacherId: Math.round(id / 2)
    };
  }

  function createState(
    bundles: BundleInterface[],
    loaded: boolean = false,
    error?: any
  ): State {
    return {
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
      loaded: loaded,
      error: error
    };
  }

  let bundleState: State;
  let storeState: any;

  describe('Bundle Selectors', () => {
    beforeEach(() => {
      bundleState = createState(
        [createBundle(4), createBundle(1), createBundle(2), createBundle(3)],
        true,
        'no error'
      );
      storeState = { bundles: bundleState };
    });
    it('getError() should return the error', () => {
      const results = BundleQueries.getError(storeState);
      expect(results).toBe(bundleState.error);
    });
    it('getLoaded() should return the loaded boolean', () => {
      const results = BundleQueries.getLoaded(storeState);
      expect(results).toBe(bundleState.loaded);
    });
    it('getAll() should return an array of the entities in the order from the ids', () => {
      const results = BundleQueries.getAll(storeState);
      expect(results).toEqual([
        createBundle(4),
        createBundle(1),
        createBundle(2),
        createBundle(3)
      ]);
    });
    it('getCount() should return number of entities', () => {
      const results = BundleQueries.getCount(storeState);
      expect(results).toBe(4);
    });
    it('getIds() should return an array with ids in the correct order', () => {
      const results = BundleQueries.getIds(storeState);
      expect(results).toEqual([4, 1, 2, 3]);
    });
    it('getAllEntities() should return a key value object with all the entities', () => {
      const results = BundleQueries.getAllEntities(storeState);
      expect(results).toEqual(bundleState.entities);
    });
    it('getByIds() should return an array of the requested entities in order and undefined if the id is not present', () => {
      const results = BundleQueries.getByIds(storeState, {
        ids: [3, 1, 90, 2]
      });
      expect(results).toEqual([
        createBundle(3),
        createBundle(1),
        undefined,
        createBundle(2)
      ]);
    });
    it('getById() should return the desired entity', () => {
      const results = BundleQueries.getById(storeState, { id: 2 });
      expect(results).toEqual(createBundle(2));
    });
    it('getById() should return undefined if the entity is not present', () => {
      const results = BundleQueries.getById(storeState, { id: 9 });
      expect(results).toBe(undefined);
    });

    it('getByLearningAreaId() should return a map by learningAreaId', () => {
      const results = BundleQueries.getByLearningAreaId(storeState);
      expect(results).toEqual({
        1: [createBundle(1), createBundle(2)],
        2: [createBundle(4), createBundle(3)]
      });
    });
    it('getShared() should return undefined if the entity is not present', () => {
      const results = BundleQueries.getShared(storeState, { userId: 1 });
      expect(results).toEqual([createBundle(4), createBundle(3)]);
    });
    it('getOwn() should return the desired entity', () => {
      const results = BundleQueries.getOwn(storeState, { userId: 1 });
      expect(results).toEqual([createBundle(1), createBundle(2)]);
    });
  });
});
