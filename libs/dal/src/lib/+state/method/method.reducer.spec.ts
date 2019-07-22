import { MethodActions } from '.';
import { MethodInterface } from '../../+models';
import { initialState, reducer, State } from './method.reducer';

/**
 * This file is scaffolded, but needs some special attention:
 * - find and replace 'name' and replace this with a property name of the Method entity.
 * - set the initial property value via '[name]InitialValue'.
 * - set the updated property value via '[name]UpdatedValue'.
 */
const nameInitialValue = 'foo';
const nameUpdatedValue = 'bar';

/**
 * Creates a Method.
 * @param {number} id
 * @returns {MethodInterface}
 */
function createMethod(
  id: number,
  name: any = nameInitialValue
): MethodInterface | any {
  return {
    id: id,
    name: name
  };
}

/**
 * Utility to create the method state.
 *
 * @param {MethodInterface[]} methods
 * @param {boolean} [loaded]
 * @param {*} [error]
 * @returns {State}
 */
function createState(
  methods: MethodInterface[],
  loaded: boolean = false,
  error?: any
): State {
  const state: any = {
    ids: methods ? methods.map(method => method.id) : [],
    entities: methods
      ? methods.reduce(
          (entityMap, method) => ({
            ...entityMap,
            [method.id]: method
          }),
          {}
        )
      : {},
    loaded: loaded,
    allowedMethods: [],
    allowedMethodsLoaded: false
  };
  if (error !== undefined) state.error = error;
  return state;
}

describe('Methods Reducer', () => {
  let methods: MethodInterface[];
  beforeEach(() => {
    methods = [createMethod(1), createMethod(2), createMethod(3)];
  });

  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });

  describe('loaded action', () => {
    it('should load all methods', () => {
      const action = new MethodActions.MethodsLoaded({ methods });
      const result = reducer(initialState, action);
      expect(result).toEqual(createState(methods, true));
    });

    it('should error', () => {
      const error = 'Something went wrong';
      const action = new MethodActions.MethodsLoadError(error);
      const result = reducer(initialState, action);
      expect(result).toEqual(createState([], false, error));
    });
  });
  describe('AllowedMethodsloaded action', () => {
    it('should load all allowed methods', () => {
      const action = new MethodActions.AllowedMethodsLoaded({
        methodIds: [1, 4, 3]
      });
      const result = reducer(initialState, action);
      expect(result).toEqual({
        ids: [],
        entities: {},
        allowedMethods: [1, 4, 3],
        allowedMethodsLoaded: true,
        loaded: false
      });
    });
  });

  describe('clear action', () => {
    it('should clear the methods collection', () => {
      const startState = createState(methods, true, 'something went wrong');
      const action = new MethodActions.ClearMethods();
      const result = reducer(startState, action);
      expect(result).toEqual(createState([], true, 'something went wrong'));
    });
  });
});
