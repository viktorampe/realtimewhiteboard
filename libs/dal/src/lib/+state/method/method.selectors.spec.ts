import { MethodQueries } from '.';
import { MethodInterface } from '../../+models';
import { MethodFixture } from './../../+fixtures/Method.fixture';
import { State } from './method.reducer';

describe('Method Selectors', () => {
  function createMethod(id: number): MethodInterface | any {
    return {
      id: id
    };
  }

  function createState(
    methods: MethodInterface[],
    loaded: boolean = false,
    error?: any
  ): State {
    return {
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
      error: error
    };
  }

  let methodState: State;
  let storeState: any;

  describe('Method Selectors', () => {
    beforeEach(() => {
      methodState = createState(
        [createMethod(4), createMethod(1), createMethod(2), createMethod(3)],
        true,
        'no error'
      );
      storeState = { methods: methodState };
    });
    it('getError() should return the error', () => {
      const results = MethodQueries.getError(storeState);
      expect(results).toBe(methodState.error);
    });
    it('getLoaded() should return the loaded boolean', () => {
      const results = MethodQueries.getLoaded(storeState);
      expect(results).toBe(methodState.loaded);
    });
    it('getAll() should return an array of the entities in the order from the ids', () => {
      const results = MethodQueries.getAll(storeState);
      expect(results).toEqual([
        createMethod(4),
        createMethod(1),
        createMethod(2),
        createMethod(3)
      ]);
    });
    it('getCount() should return number of entities', () => {
      const results = MethodQueries.getCount(storeState);
      expect(results).toBe(4);
    });
    it('getIds() should return an array with ids in the correct order', () => {
      const results = MethodQueries.getIds(storeState);
      expect(results).toEqual([4, 1, 2, 3]);
    });
    it('getAllEntities() should return a key value object with all the entities', () => {
      const results = MethodQueries.getAllEntities(storeState);
      expect(results).toEqual(methodState.entities);
    });
    it('getByIds() should return an array of the requested entities in order and undefined if the id is not present', () => {
      const results = MethodQueries.getByIds(storeState, {
        ids: [3, 1, 90, 2]
      });
      expect(results).toEqual([
        createMethod(3),
        createMethod(1),
        undefined,
        createMethod(2)
      ]);
    });
    it('getById() should return the desired entity', () => {
      const results = MethodQueries.getById(storeState, { id: 2 });
      expect(results).toEqual(createMethod(2));
    });
    it('getById() should return undefined if the entity is not present', () => {
      const results = MethodQueries.getById(storeState, { id: 9 });
      expect(results).toBe(undefined);
    });

    describe('getByLearningAreaId', () => {
      let mockMethods: MethodInterface[];

      beforeEach(() => {
        mockMethods = [
          new MethodFixture({ id: 4, learningAreaId: 1 }),
          new MethodFixture({ id: 1, learningAreaId: 1 }),
          new MethodFixture({ id: 2, learningAreaId: 2 }),
          new MethodFixture({ id: 3, learningAreaId: 3 })
        ];

        methodState = createState(mockMethods, true, 'no error');
        storeState = { methods: methodState };
      });

      it('should only return the methods with the correct learningAreaId', () => {
        const results = MethodQueries.getByLearningAreaId(storeState, {
          learningAreaId: 1
        });

        const expected = [mockMethods[1], mockMethods[0]]; // ordered by id
        expect(results).toEqual(expected);
      });

      it('should return an empty array if no methods match the learningAreaId', () => {
        const results = MethodQueries.getByLearningAreaId(storeState, {
          learningAreaId: 9
        });

        const expected = [];
        expect(results).toEqual(expected);
      });
    });
  });
});
