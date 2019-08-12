import { EduContentProductTypeQueries } from '.';
import { EduContentProductTypeInterface } from '../../+models';
import { State } from './edu-content-product-type.reducer';

describe('EduContentProductType Selectors', () => {
  function createEduContentProductType(
    id: number,
    sequence?: number,
    name?: string
  ): EduContentProductTypeInterface | any {
    return {
      id: id,
      sequence: sequence,
      name: name
    };
  }

  function createState(
    eduContentProductTypes: EduContentProductTypeInterface[],
    loaded: boolean = false,
    error?: any
  ): State {
    return {
      ids: eduContentProductTypes
        ? eduContentProductTypes.map(
            eduContentProductType => eduContentProductType.id
          )
        : [],
      entities: eduContentProductTypes
        ? eduContentProductTypes.reduce(
            (entityMap, eduContentProductType) => ({
              ...entityMap,
              [eduContentProductType.id]: eduContentProductType
            }),
            {}
          )
        : {},
      loaded: loaded,
      error: error
    };
  }

  let eduContentProductTypeState: State;
  let storeState: any;

  describe('EduContentProductType Selectors', () => {
    beforeEach(() => {
      eduContentProductTypeState = createState(
        [
          createEduContentProductType(4),
          createEduContentProductType(1),
          createEduContentProductType(2),
          createEduContentProductType(3)
        ],
        true,
        'no error'
      );
      storeState = { eduContentProductTypes: eduContentProductTypeState };
    });
    it('getError() should return the error', () => {
      const results = EduContentProductTypeQueries.getError(storeState);
      expect(results).toBe(eduContentProductTypeState.error);
    });
    it('getLoaded() should return the loaded boolean', () => {
      const results = EduContentProductTypeQueries.getLoaded(storeState);
      expect(results).toBe(eduContentProductTypeState.loaded);
    });
    it('getAll() should return an array of the entities in the order from the ids', () => {
      const results = EduContentProductTypeQueries.getAll(storeState);
      expect(results).toEqual([
        createEduContentProductType(4),
        createEduContentProductType(1),
        createEduContentProductType(2),
        createEduContentProductType(3)
      ]);
    });
    it('getCount() should return number of entities', () => {
      const results = EduContentProductTypeQueries.getCount(storeState);
      expect(results).toBe(4);
    });
    it('getIds() should return an array with ids in the correct order', () => {
      const results = EduContentProductTypeQueries.getIds(storeState);
      expect(results).toEqual([4, 1, 2, 3]);
    });
    it('getAllEntities() should return a key value object with all the entities', () => {
      const results = EduContentProductTypeQueries.getAllEntities(storeState);
      expect(results).toEqual(eduContentProductTypeState.entities);
    });
    it('getByIds() should return an array of the requested entities in order and undefined if the id is not present', () => {
      const results = EduContentProductTypeQueries.getByIds(storeState, {
        ids: [3, 1, 90, 2]
      });
      expect(results).toEqual([
        createEduContentProductType(3),
        createEduContentProductType(1),
        undefined,
        createEduContentProductType(2)
      ]);
    });
    it('getById() should return the desired entity', () => {
      const results = EduContentProductTypeQueries.getById(storeState, {
        id: 2
      });
      expect(results).toEqual(createEduContentProductType(2));
    });
    it('getById() should return undefined if the entity is not present', () => {
      const results = EduContentProductTypeQueries.getById(storeState, {
        id: 9
      });
      expect(results).toBe(undefined);
    });
  });
  describe('EduContentProductType Selectors', () => {
    beforeEach(() => {
      eduContentProductTypeState = createState(
        [
          createEduContentProductType(4),
          createEduContentProductType(1),
          createEduContentProductType(2),
          createEduContentProductType(3)
        ],
        true,
        'no error'
      );
      storeState = { eduContentProductTypes: eduContentProductTypeState };
    });
    it('getError() should return the error', () => {
      const results = EduContentProductTypeQueries.getError(storeState);
      expect(results).toBe(eduContentProductTypeState.error);
    });
    it('getLoaded() should return the loaded boolean', () => {
      const results = EduContentProductTypeQueries.getLoaded(storeState);
      expect(results).toBe(eduContentProductTypeState.loaded);
    });
    it('getAll() should return an array of the entities in the order from the ids', () => {
      const results = EduContentProductTypeQueries.getAll(storeState);
      expect(results).toEqual([
        createEduContentProductType(4),
        createEduContentProductType(1),
        createEduContentProductType(2),
        createEduContentProductType(3)
      ]);
    });
    it('getCount() should return number of entities', () => {
      const results = EduContentProductTypeQueries.getCount(storeState);
      expect(results).toBe(4);
    });
    it('getIds() should return an array with ids in the correct order', () => {
      const results = EduContentProductTypeQueries.getIds(storeState);
      expect(results).toEqual([4, 1, 2, 3]);
    });
    it('getAllEntities() should return a key value object with all the entities', () => {
      const results = EduContentProductTypeQueries.getAllEntities(storeState);
      expect(results).toEqual(eduContentProductTypeState.entities);
    });
    it('getByIds() should return an array of the requested entities in order and undefined if the id is not present', () => {
      const results = EduContentProductTypeQueries.getByIds(storeState, {
        ids: [3, 1, 90, 2]
      });
      expect(results).toEqual([
        createEduContentProductType(3),
        createEduContentProductType(1),
        undefined,
        createEduContentProductType(2)
      ]);
    });
    it('getById() should return the desired entity', () => {
      const results = EduContentProductTypeQueries.getById(storeState, {
        id: 2
      });
      expect(results).toEqual(createEduContentProductType(2));
    });
    it('getById() should return undefined if the entity is not present', () => {
      const results = EduContentProductTypeQueries.getById(storeState, {
        id: 9
      });
      expect(results).toBe(undefined);
    });
  });
  describe('EduContentProductTypeOrderBy selector', () => {
    beforeEach(() => {
      eduContentProductTypeState = createState(
        [
          createEduContentProductType(4, 0, 'd'),
          createEduContentProductType(1, 3, 'a'),
          createEduContentProductType(2, 1, 'c'),
          createEduContentProductType(3, 2, 'b')
        ],
        true,
        'no error'
      );
      storeState = { eduContentProductTypes: eduContentProductTypeState };
    });
    it('should return array ordered by sequence if prop orderby type is sequence', () => {
      const results = EduContentProductTypeQueries.getAllOrderedBy(storeState, {
        orderBy: 'sequence'
      });
      expect(results).toEqual([
        createEduContentProductType(4, 0, 'd'),
        createEduContentProductType(2, 1, 'c'),
        createEduContentProductType(3, 2, 'b'),
        createEduContentProductType(1, 3, 'a')
      ]);
    });
    it('should return array ordered by name if prop orderby type is name', () => {
      const results = EduContentProductTypeQueries.getAllOrderedBy(storeState, {
        orderBy: 'name'
      });
      expect(results).toEqual([
        createEduContentProductType(1, 3, 'a'),
        createEduContentProductType(3, 2, 'b'),
        createEduContentProductType(2, 1, 'c'),
        createEduContentProductType(4, 0, 'd')
      ]);
    });
  });
});
