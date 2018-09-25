import { BundlesLoaded } from './bundles.actions';
import {
  BundlesState,
  Entity,
  initialState,
  bundlesReducer
} from './bundles.reducer';

describe('Bundles Reducer', () => {
  const getBundlesId = it => it['id'];
  let createBundles;

  beforeEach(() => {
    createBundles = (id: string, name = ''): Entity => ({
      id,
      name: name || `name-${id}`
    });
  });

  describe('valid Bundles actions ', () => {
    it('should return set the list of known Bundles', () => {
      const bundless = [
        createBundles('PRODUCT-AAA'),
        createBundles('PRODUCT-zzz')
      ];
      const action = new BundlesLoaded(bundless);
      const result: BundlesState = bundlesReducer(initialState, action);
      const selId: string = getBundlesId(result.list[1]);

      expect(result.loaded).toBe(true);
      expect(result.list.length).toBe(2);
      expect(selId).toBe('PRODUCT-zzz');
    });
  });

  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any;
      const result = bundlesReducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
