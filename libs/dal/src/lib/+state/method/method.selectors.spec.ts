import { MethodQueries } from '.';
import { YearFixture } from '../../+fixtures';
import { MethodInterface } from '../../+models';
import { State as YearState } from '../year/year.reducer';
import { MethodFixture } from './../../+fixtures/Method.fixture';
import { State } from './method.reducer';
import { getAllowedMethodIds, getAllowedMethods } from './method.selectors';

describe('Method Selectors', () => {
  function createMethod(id: number): MethodInterface | any {
    return {
      id: id
    };
  }

  function createState(
    methods: MethodInterface[],
    loaded: boolean = false,
    allowedMethods: number[] = [],
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
      error: error,
      allowedMethods: allowedMethods
    };
  }

  let methodState: State;
  let storeState: { methods: State };

  describe('Method Selectors', () => {
    beforeEach(() => {
      methodState = createState(
        [createMethod(4), createMethod(1), createMethod(2), createMethod(3)],
        true,
        [],
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

    describe('isAllowedMethod', () => {
      it('should return true if the provided method id is allowed', () => {
        storeState.methods.allowedMethods = [1, 2];

        const result = MethodQueries.isAllowedMethod(storeState, { id: 1 });
        expect(result).toBe(true);
      });
      it('should return false if the provided method id is not allowed', () => {
        storeState.methods.allowedMethods = [1, 2, 4];

        const result = MethodQueries.isAllowedMethod(storeState, { id: 3 });
        expect(result).toBe(false);
      });
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

        methodState = createState(mockMethods, true, [], 'no error');
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

    describe('getByLearningAreaIds', () => {
      let mockMethods: MethodInterface[];

      beforeEach(() => {
        mockMethods = [
          new MethodFixture({ id: 4, learningAreaId: 1 }),
          new MethodFixture({ id: 1, learningAreaId: 1 }),
          new MethodFixture({ id: 2, learningAreaId: 2 }),
          new MethodFixture({ id: 3, learningAreaId: 3 })
        ];

        methodState = createState(mockMethods, true, [], 'no error');
        storeState = { methods: methodState };
      });

      it('should only return the methods with the correct learningAreaIds', () => {
        const results = MethodQueries.getByLearningAreaIds(storeState, {
          learningAreaIds: [1, 3]
        });

        const expected = [mockMethods[1], mockMethods[3], mockMethods[0]]; // ordered by id
        expect(results).toEqual(expected);
      });

      it('should return an empty array if no methods match the learningAreaIds', () => {
        const results = MethodQueries.getByLearningAreaIds(storeState, {
          learningAreaIds: [9, 12]
        });

        const expected = [];
        expect(results).toEqual(expected);
      });
    });

    describe('getAllowedMethods', () => {
      it('should return an empty array if there are no allowed methods', () => {
        storeState.methods.allowedMethods = [];

        const result = getAllowedMethods(storeState);
        expect(result).toEqual([]);
      });

      it('should return all allowed methods', () => {
        const mockMethods = [
          new MethodFixture({ id: 4 }),
          new MethodFixture({ id: 1 }),
          new MethodFixture({ id: 2 }),
          new MethodFixture({ id: 3 })
        ];

        methodState = createState(mockMethods, true, [1, 2], 'no error');
        storeState = { methods: methodState };

        const result = getAllowedMethods(storeState);
        expect(result).toEqual([mockMethods[1], mockMethods[2]]);
      });
    });

    describe('getAllowedMethodIds', () => {
      it('should return an empty array if there are no allowed methods', () => {
        const result = getAllowedMethodIds(storeState);
        expect(result).toEqual([]);
      });

      it('should return all allowed method ids', () => {
        storeState.methods.allowedMethods = [1, 2];

        const result = getAllowedMethodIds(storeState);
        expect(result).toEqual([1, 2]);
      });
    });

    describe('getMethodWithYear', () => {
      it('should return the method name and year name combination', () => {
        const mockMethods = [
          new MethodFixture({ id: 1, name: 'foo method' }),
          new MethodFixture({ id: 2, name: 'bar method' }),
          new MethodFixture({ id: 3, name: ' baz method' })
        ];

        methodState = createState(mockMethods, true, [], 'no error');

        const mockYears = [
          new YearFixture({ id: 1, label: 'foo year' }),
          new YearFixture({ id: 2, label: 'bar year' }),
          new YearFixture({ id: 3, label: 'baz year' })
        ];

        const yearState: YearState = {
          ids: [1, 2, 3],
          entities: {
            1: mockYears[0],
            2: mockYears[1],
            3: mockYears[2]
          },
          loaded: true
        };

        const methodAndYearState = { years: yearState, methods: methodState };

        const result = MethodQueries.getMethodWithYear(methodAndYearState, {
          methodId: 1,
          yearId: 3
        });

        expect(result).toBe('foo method baz year');
      });
    });
  });
});
