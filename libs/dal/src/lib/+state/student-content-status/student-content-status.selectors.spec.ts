import { StudentContentStatusQueries } from '.';
import { StudentContentStatusInterface } from '../../+models';
import { State } from './student-content-status.reducer';

describe('StudentContentStatus Selectors', () => {
  function createStudentContentStatus(
    id: number
  ): StudentContentStatusInterface | any {
    return {
      id: id
    };
  }

  function createState(
    StudentContentStatuses: StudentContentStatusInterface[],
    loaded: boolean = false,
    error?: any
  ): State {
    return {
      ids: StudentContentStatuses
        ? StudentContentStatuses.map(
            studentContentStatus => studentContentStatus.id
          )
        : [],
      entities: StudentContentStatuses
        ? StudentContentStatuses.reduce(
            (entityMap, studentContentStatus) => ({
              ...entityMap,
              [studentContentStatus.id]: studentContentStatus
            }),
            {}
          )
        : {},
      loaded: loaded,
      error: error
    };
  }

  let StudentContentStatusestate: State;
  let storeState: any;

  describe('StudentContentStatus Selectors', () => {
    beforeEach(() => {
      StudentContentStatusestate = createState(
        [
          createStudentContentStatus(4),
          createStudentContentStatus(1),
          createStudentContentStatus(2),
          createStudentContentStatus(3)
        ],
        true,
        'no error'
      );
      storeState = { StudentContentStatuses: StudentContentStatusestate };
    });
    it('getError() should return the error', () => {
      const results = StudentContentStatusQueries.getError(storeState);
      expect(results).toBe(StudentContentStatusestate.error);
    });
    it('getLoaded() should return the loaded boolean', () => {
      const results = StudentContentStatusQueries.getLoaded(storeState);
      expect(results).toBe(StudentContentStatusestate.loaded);
    });
    it('getAll() should return an array of the entities in the order from the ids', () => {
      const results = StudentContentStatusQueries.getAll(storeState);
      expect(results).toEqual([
        createStudentContentStatus(4),
        createStudentContentStatus(1),
        createStudentContentStatus(2),
        createStudentContentStatus(3)
      ]);
    });
    it('getCount() should return number of entities', () => {
      const results = StudentContentStatusQueries.getCount(storeState);
      expect(results).toBe(4);
    });
    it('getIds() should return an array with ids in the correct order', () => {
      const results = StudentContentStatusQueries.getIds(storeState);
      expect(results).toEqual([4, 1, 2, 3]);
    });
    it('getAllEntities() should return a key value object with all the entities', () => {
      const results = StudentContentStatusQueries.getAllEntities(storeState);
      expect(results).toEqual(StudentContentStatusestate.entities);
    });
    it('getByIds() should return an array of the requested entities in order and undefined if the id is not present', () => {
      const results = StudentContentStatusQueries.getByIds(storeState, {
        ids: [3, 1, 90, 2]
      });
      expect(results).toEqual([
        createStudentContentStatus(3),
        createStudentContentStatus(1),
        undefined,
        createStudentContentStatus(2)
      ]);
    });
    it('getById() should return the desired entity', () => {
      const results = StudentContentStatusQueries.getById(storeState, {
        id: 2
      });
      expect(results).toEqual(createStudentContentStatus(2));
    });
    it('getById() should return undefined if the entity is not present', () => {
      const results = StudentContentStatusQueries.getById(storeState, {
        id: 9
      });
      expect(results).toBe(undefined);
    });
  });
});
