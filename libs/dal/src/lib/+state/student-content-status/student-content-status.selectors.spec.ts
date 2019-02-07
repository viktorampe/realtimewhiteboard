import { Dictionary } from 'lodash';
import { StudentContentStatusQueries } from '.';
import { StudentContentStatusFixture } from '../../+fixtures';
import { StudentContentStatusInterface } from '../../+models';
import { State } from './student-content-status.reducer';

describe('StudentContentStatus Selectors', () => {
  function createStudentContentStatus(
    id: number
  ): StudentContentStatusInterface | any {
    return new StudentContentStatusFixture({
      id,
      unlockedContentId: id === 4 ? 2 : 1,
      taskEduContentId: id === 3 ? 2 : 1
    });
  }

  function createState(
    studentContentStatuses: StudentContentStatusInterface[],
    loaded: boolean = false,
    error?: any
  ): State {
    return {
      ids: studentContentStatuses
        ? studentContentStatuses.map(
            studentContentStatus => studentContentStatus.id
          )
        : [],
      entities: studentContentStatuses
        ? <Dictionary<StudentContentStatusInterface>>(
            studentContentStatuses.reduce(
              (entityMap, studentContentStatus) => ({
                ...entityMap,
                [studentContentStatus.id]: studentContentStatus
              }),
              {}
            )
          )
        : {},
      loaded: loaded,
      error: error
    };
  }

  let studentContentStatusesState: State;
  let storeState: any;

  describe('StudentContentStatus Selectors', () => {
    beforeEach(() => {
      studentContentStatusesState = createState(
        [
          createStudentContentStatus(4),
          createStudentContentStatus(1),
          createStudentContentStatus(2),
          createStudentContentStatus(3)
        ],
        true,
        'no error'
      );
      storeState = { studentContentStatuses: studentContentStatusesState };
    });
    it('getError() should return the error', () => {
      const results = StudentContentStatusQueries.getError(storeState);
      expect(results).toBe(studentContentStatusesState.error);
    });
    it('getLoaded() should return the loaded boolean', () => {
      const results = StudentContentStatusQueries.getLoaded(storeState);
      expect(results).toBe(studentContentStatusesState.loaded);
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
      expect(results).toEqual(studentContentStatusesState.entities);
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
    it('getGroupedByUnlockedContentId() should return entities by unlockedContentId', () => {
      const results = StudentContentStatusQueries.getGroupedByUnlockedContentId(
        storeState
      );
      expect(results).toEqual({
        1: [
          createStudentContentStatus(1),
          createStudentContentStatus(2),
          createStudentContentStatus(3)
        ],
        2: [createStudentContentStatus(4)]
      });
    });
    it('getByUnlockedContentId() should return entity by unlockedContentId', () => {
      const results = StudentContentStatusQueries.getByUnlockedContentId(
        storeState,
        { unlockedContentId: 2 }
      );
      expect(results).toEqual(createStudentContentStatus(4));
    });
    it('getByUnlockedContentId() should return null when not found', () => {
      const results = StudentContentStatusQueries.getByUnlockedContentId(
        storeState,
        { unlockedContentId: 20 }
      );
      expect(results).toBeNull();
    });
    it('getGroupedByTaskEduContentId() should return entities by taskEduContentId', () => {
      const results = StudentContentStatusQueries.getGroupedByTaskEduContentId(
        storeState
      );
      expect(results).toEqual({
        1: [
          createStudentContentStatus(1),
          createStudentContentStatus(2),
          createStudentContentStatus(4)
        ],
        2: [createStudentContentStatus(3)]
      });
    });
    it('getByTaskEduContentId() should return entity by unlockedContentId', () => {
      const results = StudentContentStatusQueries.getByTaskEduContentId(
        storeState,
        { taskEduContentId: 2 }
      );
      expect(results).toEqual(createStudentContentStatus(3));
    });
    it('getByTaskEduContentId() should return null when not found', () => {
      const results = StudentContentStatusQueries.getByTaskEduContentId(
        storeState,
        { taskEduContentId: 20 }
      );
      expect(results).toBeNull();
    });
  });
});
