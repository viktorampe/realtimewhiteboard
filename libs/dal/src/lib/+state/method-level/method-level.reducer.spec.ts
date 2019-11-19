import { MethodLevelActions } from '.';
import { MethodLevelInterface } from '../../+models';
import { initialState, reducer, State } from './method-level.reducer';

const labelInitialValue = 'knikker';
const labelUpdatedValue = 'kei';

/**
 * Creates a MethodLevel.
 * @param {number} id
 * @returns {MethodLevelInterface}
 */
function createMethodLevel(
  id: number,
  label: any = labelInitialValue
): MethodLevelInterface | any {
  return {
    id: id,
    label: label
  };
}

/**
 * Utility to create the method-level state.
 *
 * @param {MethodLevelInterface[]} methodLevels
 * @param {boolean} [loaded]
 * @param {*} [error]
 * @returns {State}
 */
function createState(
  methodLevels: MethodLevelInterface[],
  loaded: boolean = false,
  error?: any
): State {
  const state: any = {
    ids: methodLevels ? methodLevels.map(methodLevel => methodLevel.id) : [],
    entities: methodLevels
      ? methodLevels.reduce(
          (entityMap, methodLevel) => ({
            ...entityMap,
            [methodLevel.id]: methodLevel
          }),
          {}
        )
      : {},
    loaded: loaded
  };
  if (error !== undefined) state.error = error;
  return state;
}

describe('MethodLevels Reducer', () => {
  let methodLevels: MethodLevelInterface[];
  beforeEach(() => {
    methodLevels = [
      createMethodLevel(1),
      createMethodLevel(2),
      createMethodLevel(3)
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
    it('should load all methodLevels', () => {
      const action = new MethodLevelActions.MethodLevelsLoaded({
        methodLevels
      });
      const result = reducer(initialState, action);
      expect(result).toEqual(createState(methodLevels, true));
    });

    it('should error', () => {
      const error = 'Something went wrong';
      const action = new MethodLevelActions.MethodLevelsLoadError(error);
      const result = reducer(initialState, action);
      expect(result).toEqual(createState([], false, error));
    });
  });
});
