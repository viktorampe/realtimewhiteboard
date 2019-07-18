import { DiaboloPhaseActions } from '.';
import { DiaboloPhaseInterface } from '../../+models';
import { initialState, reducer, State } from './diabolo-phase.reducer';

/**
 * Creates a DiaboloPhase.
 * @param {number} id
 * @returns {DiaboloPhaseInterface}
 */
function createDiaboloPhase(
  id: number,
  name: string = 'intro'
): DiaboloPhaseInterface | any {
  return {
    id: id,
    name
  };
}

/**
 * Utility to create the diabolo-phase state.
 *
 * @param {DiaboloPhaseInterface[]} diaboloPhases
 * @param {boolean} [loaded]
 * @param {*} [error]
 * @returns {State}
 */
function createState(
  diaboloPhases: DiaboloPhaseInterface[],
  loaded: boolean = false,
  error?: any
): State {
  const state: any = {
    ids: diaboloPhases
      ? diaboloPhases.map(diaboloPhase => diaboloPhase.id)
      : [],
    entities: diaboloPhases
      ? diaboloPhases.reduce(
          (entityMap, diaboloPhase) => ({
            ...entityMap,
            [diaboloPhase.id]: diaboloPhase
          }),
          {}
        )
      : {},
    loaded: loaded
  };
  if (error !== undefined) state.error = error;
  return state;
}

describe('DiaboloPhases Reducer', () => {
  let diaboloPhases: DiaboloPhaseInterface[];
  beforeEach(() => {
    diaboloPhases = [
      createDiaboloPhase(1),
      createDiaboloPhase(2),
      createDiaboloPhase(3)
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
    it('should load all diaboloPhases', () => {
      const action = new DiaboloPhaseActions.DiaboloPhasesLoaded({
        diaboloPhases
      });
      const result = reducer(initialState, action);
      expect(result).toEqual(createState(diaboloPhases, true));
    });

    it('should error', () => {
      const error = 'Something went wrong';
      const action = new DiaboloPhaseActions.DiaboloPhasesLoadError(error);
      const result = reducer(initialState, action);
      expect(result).toEqual(createState([], false, error));
    });
  });
});
