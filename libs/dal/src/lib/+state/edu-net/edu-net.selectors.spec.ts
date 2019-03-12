import { EduNetQueries } from '.';
import { EduNetInterface } from '../../+models';
import { State } from './edu-net.reducer';

describe('EduNet Selectors', () => {
  function createEduNet(id: number): EduNetInterface | any {
    return {
      id: id
    };
  }

  function createState(
    eduNets: EduNetInterface[],
    loaded: boolean = false,
    error?: any
  ): State {
    return {
      ids: eduNets ? eduNets.map(eduNet => eduNet.id) : [],
      entities: eduNets
        ? eduNets.reduce(
            (entityMap, eduNet) => ({
              ...entityMap,
              [eduNet.id]: eduNet
            }),
            {}
          )
        : {},
      loaded: loaded,
      error: error
    };
  }

  let eduNetState: State;
  let storeState: any;

  describe('EduNet Selectors', () => {
    beforeEach(() => {
      eduNetState = createState(
        [createEduNet(4), createEduNet(1), createEduNet(2), createEduNet(3)],
        true,
        'no error'
      );
      storeState = { eduNets: eduNetState };
    });
    it('getError() should return the error', () => {
      const results = EduNetQueries.getError(storeState);
      expect(results).toBe(eduNetState.error);
    });
    it('getLoaded() should return the loaded boolean', () => {
      const results = EduNetQueries.getLoaded(storeState);
      expect(results).toBe(eduNetState.loaded);
    });
    it('getAll() should return an array of the entities in the order from the ids', () => {
      const results = EduNetQueries.getAll(storeState);
      expect(results).toEqual([
        createEduNet(4),
        createEduNet(1),
        createEduNet(2),
        createEduNet(3)
      ]);
    });
    it('getCount() should return number of entities', () => {
      const results = EduNetQueries.getCount(storeState);
      expect(results).toBe(4);
    });
    it('getIds() should return an array with ids in the correct order', () => {
      const results = EduNetQueries.getIds(storeState);
      expect(results).toEqual([4, 1, 2, 3]);
    });
    it('getAllEntities() should return a key value object with all the entities', () => {
      const results = EduNetQueries.getAllEntities(storeState);
      expect(results).toEqual(eduNetState.entities);
    });
    it('getByIds() should return an array of the requested entities in order and undefined if the id is not present', () => {
      const results = EduNetQueries.getByIds(storeState, {
        ids: [3, 1, 90, 2]
      });
      expect(results).toEqual([
        createEduNet(3),
        createEduNet(1),
        undefined,
        createEduNet(2)
      ]);
    });
    it('getById() should return the desired entity', () => {
      const results = EduNetQueries.getById(storeState, { id: 2 });
      expect(results).toEqual(createEduNet(2));
    });
    it('getById() should return undefined if the entity is not present', () => {
      const results = EduNetQueries.getById(storeState, { id: 9 });
      expect(results).toBe(undefined);
    });
  });
});
