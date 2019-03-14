import { SchoolTypeQueries } from '.';
import { SchoolTypeInterface } from '../../+models';
import { State } from './school-type.reducer';

describe('SchoolType Selectors', () => {
  function createSchoolType(id: number): SchoolTypeInterface | any {
    return {
      id: id
    };
  }

  function createState(
    schoolTypes: SchoolTypeInterface[],
    loaded: boolean = false,
    error?: any
  ): State {
    return {
      ids: schoolTypes ? schoolTypes.map(schoolType => schoolType.id) : [],
      entities: schoolTypes
        ? schoolTypes.reduce(
            (entityMap, schoolType) => ({
              ...entityMap,
              [schoolType.id]: schoolType
            }),
            {}
          )
        : {},
      loaded: loaded,
      error: error
    };
  }

  let schoolTypeState: State;
  let storeState: any;

  describe('SchoolType Selectors', () => {
    beforeEach(() => {
      schoolTypeState = createState(
        [
          createSchoolType(4),
          createSchoolType(1),
          createSchoolType(2),
          createSchoolType(3)
        ],
        true,
        'no error'
      );
      storeState = { schoolTypes: schoolTypeState };
    });
    it('getError() should return the error', () => {
      const results = SchoolTypeQueries.getError(storeState);
      expect(results).toBe(schoolTypeState.error);
    });
    it('getLoaded() should return the loaded boolean', () => {
      const results = SchoolTypeQueries.getLoaded(storeState);
      expect(results).toBe(schoolTypeState.loaded);
    });
    it('getAll() should return an array of the entities in the order from the ids', () => {
      const results = SchoolTypeQueries.getAll(storeState);
      expect(results).toEqual([
        createSchoolType(4),
        createSchoolType(1),
        createSchoolType(2),
        createSchoolType(3)
      ]);
    });
    it('getCount() should return number of entities', () => {
      const results = SchoolTypeQueries.getCount(storeState);
      expect(results).toBe(4);
    });
    it('getIds() should return an array with ids in the correct order', () => {
      const results = SchoolTypeQueries.getIds(storeState);
      expect(results).toEqual([4, 1, 2, 3]);
    });
    it('getAllEntities() should return a key value object with all the entities', () => {
      const results = SchoolTypeQueries.getAllEntities(storeState);
      expect(results).toEqual(schoolTypeState.entities);
    });
    it('getByIds() should return an array of the requested entities in order and undefined if the id is not present', () => {
      const results = SchoolTypeQueries.getByIds(storeState, {
        ids: [3, 1, 90, 2]
      });
      expect(results).toEqual([
        createSchoolType(3),
        createSchoolType(1),
        undefined,
        createSchoolType(2)
      ]);
    });
    it('getById() should return the desired entity', () => {
      const results = SchoolTypeQueries.getById(storeState, { id: 2 });
      expect(results).toEqual(createSchoolType(2));
    });
    it('getById() should return undefined if the entity is not present', () => {
      const results = SchoolTypeQueries.getById(storeState, { id: 9 });
      expect(results).toBe(undefined);
    });
  });
});
