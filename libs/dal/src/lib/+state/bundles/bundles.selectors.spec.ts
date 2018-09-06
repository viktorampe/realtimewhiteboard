import { Entity, BundlesState } from './bundles.reducer';
import { bundlesQuery } from './bundles.selectors';

describe('Bundles Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getBundlesId = it => it['id'];

  let storeState;

  beforeEach(() => {
    const createBundles = (id: string, name = ''): Entity => ({
      id,
      name: name || `name-${id}`
    });
    storeState = {
      bundles: {
        list: [
          createBundles('PRODUCT-AAA'),
          createBundles('PRODUCT-BBB'),
          createBundles('PRODUCT-CCC')
        ],
        selectedId: 'PRODUCT-BBB',
        error: ERROR_MSG,
        loaded: true
      }
    };
  });

  describe('Bundles Selectors', () => {
    it('getAllBundles() should return the list of Bundles', () => {
      const results = bundlesQuery.getAllBundles(storeState);
      const selId = getBundlesId(results[1]);

      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });

    it('getSelectedBundles() should return the selected Entity', () => {
      const result = bundlesQuery.getSelectedBundles(storeState);
      const selId = getBundlesId(result);

      expect(selId).toBe('PRODUCT-BBB');
    });

    it("getLoaded() should return the current 'loaded' status", () => {
      const result = bundlesQuery.getLoaded(storeState);

      expect(result).toBe(true);
    });

    it("getError() should return the current 'error' storeState", () => {
      const result = bundlesQuery.getError(storeState);

      expect(result).toBe(ERROR_MSG);
    });
  });
});
