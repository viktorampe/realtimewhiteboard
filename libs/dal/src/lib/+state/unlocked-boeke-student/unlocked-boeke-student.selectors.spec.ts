import { UnlockedBoekeStudentQueries } from '.';
import { UnlockedBoekeStudentInterface } from '../../+models';
import { State } from './unlocked-boeke-student.reducer';

describe('UnlockedBoekeStudent Selectors', () => {
  function createUnlockedBoekeStudent(
    id: number
  ): UnlockedBoekeStudentInterface | any {
    return {
      id: id,
      teacherId: Math.round(id / 2)
    };
  }
  function createState(
    unlockedBoekeStudents: UnlockedBoekeStudentInterface[],
    loaded: boolean = false,
    error?: any
  ): State {
    return {
      ids: unlockedBoekeStudents
        ? unlockedBoekeStudents.map(
            unlockedBoekeStudent => unlockedBoekeStudent.id
          )
        : [],
      entities: unlockedBoekeStudents
        ? unlockedBoekeStudents.reduce(
            (entityMap, unlockedBoekeStudent) => ({
              ...entityMap,
              [unlockedBoekeStudent.id]: unlockedBoekeStudent
            }),
            {}
          )
        : {},
      loaded: loaded,
      error: error
    };
  }

  let unlockedBoekeStudentState: State;
  let storeState: any;

  describe('UnlockedBoekeStudent Selectors', () => {
    beforeEach(() => {
      unlockedBoekeStudentState = createState(
        [
          createUnlockedBoekeStudent(4),
          createUnlockedBoekeStudent(1),
          createUnlockedBoekeStudent(2),
          createUnlockedBoekeStudent(3)
        ],
        true,
        'no error'
      );
      storeState = { unlockedBoekeStudents: unlockedBoekeStudentState };
    });
    it('getError() should return the error', () => {
      const results = UnlockedBoekeStudentQueries.getError(storeState);
      expect(results).toBe(unlockedBoekeStudentState.error);
    });
    it('getLoaded() should return the loaded boolean', () => {
      const results = UnlockedBoekeStudentQueries.getLoaded(storeState);
      expect(results).toBe(unlockedBoekeStudentState.loaded);
    });
    it('getAll() should return an array of the entities in the order from the ids', () => {
      const results = UnlockedBoekeStudentQueries.getAll(storeState);
      expect(results).toEqual([
        createUnlockedBoekeStudent(4),
        createUnlockedBoekeStudent(1),
        createUnlockedBoekeStudent(2),
        createUnlockedBoekeStudent(3)
      ]);
    });
    it('getCount() should return number of entities', () => {
      const results = UnlockedBoekeStudentQueries.getCount(storeState);
      expect(results).toBe(4);
    });
    it('getIds() should return an array with ids in the correct order', () => {
      const results = UnlockedBoekeStudentQueries.getIds(storeState);
      expect(results).toEqual([4, 1, 2, 3]);
    });
    it('getAllEntities() should return a key value object with all the entities', () => {
      const results = UnlockedBoekeStudentQueries.getAllEntities(storeState);
      expect(results).toEqual(unlockedBoekeStudentState.entities);
    });
    it('getByIds() should return an array of the requested entities in order and undefined if the id is not present', () => {
      const results = UnlockedBoekeStudentQueries.getByIds(storeState, {
        ids: [3, 1, 90, 2]
      });
      expect(results).toEqual([
        createUnlockedBoekeStudent(3),
        createUnlockedBoekeStudent(1),
        undefined,
        createUnlockedBoekeStudent(2)
      ]);
    });
    it('getById() should return the desired entity', () => {
      const results = UnlockedBoekeStudentQueries.getById(storeState, {
        id: 2
      });
      expect(results).toEqual(createUnlockedBoekeStudent(2));
    });
    it('getById() should return undefined if the entity is not present', () => {
      const results = UnlockedBoekeStudentQueries.getById(storeState, {
        id: 9
      });
      expect(results).toBe(undefined);
    });

    it('getShared() should return undefined if the entity is not present', () => {
      const results = UnlockedBoekeStudentQueries.getShared(storeState, {
        userId: 1
      });
      expect(results).toEqual([
        createUnlockedBoekeStudent(4),
        createUnlockedBoekeStudent(3)
      ]);
    });
    it('getOwn() should return the desired entity', () => {
      const results = UnlockedBoekeStudentQueries.getOwn(storeState, {
        userId: 1
      });
      expect(results).toEqual([
        createUnlockedBoekeStudent(1),
        createUnlockedBoekeStudent(2)
      ]);
    });
  });
});
