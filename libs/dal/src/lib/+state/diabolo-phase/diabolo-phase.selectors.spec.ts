import { DiaboloPhaseQueries } from '.';
import { DiaboloPhaseInterface } from '../../+models';
import { State } from './diabolo-phase.reducer';

describe('DiaboloPhase Selectors', () => {
  function createDiaboloPhase(id: number): DiaboloPhaseInterface | any {
    return {
      id: id
    };
  }

  function createState(
    diaboloPhases: DiaboloPhaseInterface[],
    loaded: boolean = false,
    error?: any
  ): State {
    return {
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
      loaded: loaded,
      error: error
    };
  }

  let diaboloPhaseState: State;
  let storeState: any;

  describe('DiaboloPhase Selectors', () => {
    beforeEach(() => {
      diaboloPhaseState = createState(
        [
          createDiaboloPhase(4),
          createDiaboloPhase(1),
          createDiaboloPhase(2),
          createDiaboloPhase(3)
        ],
        true,
        'no error'
      );
      storeState = { diaboloPhases: diaboloPhaseState };
    });
    it('getError() should return the error', () => {
      const results = DiaboloPhaseQueries.getError(storeState);
      expect(results).toBe(diaboloPhaseState.error);
    });
    it('getLoaded() should return the loaded boolean', () => {
      const results = DiaboloPhaseQueries.getLoaded(storeState);
      expect(results).toBe(diaboloPhaseState.loaded);
    });
    it('getAll() should return an array of the entities in the order from the ids', () => {
      const results = DiaboloPhaseQueries.getAll(storeState);
      expect(results).toEqual([
        createDiaboloPhase(4),
        createDiaboloPhase(1),
        createDiaboloPhase(2),
        createDiaboloPhase(3)
      ]);
    });
    it('getCount() should return number of entities', () => {
      const results = DiaboloPhaseQueries.getCount(storeState);
      expect(results).toBe(4);
    });
    it('getIds() should return an array with ids in the correct order', () => {
      const results = DiaboloPhaseQueries.getIds(storeState);
      expect(results).toEqual([4, 1, 2, 3]);
    });
    it('getAllEntities() should return a key value object with all the entities', () => {
      const results = DiaboloPhaseQueries.getAllEntities(storeState);
      expect(results).toEqual(diaboloPhaseState.entities);
    });
    it('getByIds() should return an array of the requested entities in order and undefined if the id is not present', () => {
      const results = DiaboloPhaseQueries.getByIds(storeState, {
        ids: [3, 1, 90, 2]
      });
      expect(results).toEqual([
        createDiaboloPhase(3),
        createDiaboloPhase(1),
        undefined,
        createDiaboloPhase(2)
      ]);
    });
    it('getById() should return the desired entity', () => {
      const results = DiaboloPhaseQueries.getById(storeState, { id: 2 });
      expect(results).toEqual(createDiaboloPhase(2));
    });
    it('getById() should return undefined if the entity is not present', () => {
      const results = DiaboloPhaseQueries.getById(storeState, { id: 9 });
      expect(results).toBe(undefined);
    });
  });
});
