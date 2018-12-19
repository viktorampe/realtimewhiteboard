import { LinkedPersonQueries } from '.';
import { LinkedPersonFixture } from '../../+fixtures';
import { TeacherStudentInterface } from '../../+models';
import { State } from './linked-person.reducer';

describe('LinkedPerson Selectors', () => {
  function createLinkedPerson(id: number): TeacherStudentInterface | any {
    return new LinkedPersonFixture({
      id: id,
      teacherId: id + 1,
      studentId: id + 2
    });
  }

  function createState(
    linkedPersons: TeacherStudentInterface[],
    loaded: boolean = false,
    error?: any
  ): State {
    return {
      ids: linkedPersons
        ? linkedPersons.map(linkedPerson => linkedPerson.id)
        : [],
      entities: linkedPersons
        ? linkedPersons.reduce(
            (entityMap, linkedPerson) => ({
              ...entityMap,
              [linkedPerson.id]: linkedPerson
            }),
            {}
          )
        : {},
      loaded: loaded,
      error: error
    };
  }

  let linkedPersonState: State;
  let storeState: any;

  describe('LinkedPerson Selectors', () => {
    beforeEach(() => {
      linkedPersonState = createState(
        [
          createLinkedPerson(4),
          createLinkedPerson(1),
          createLinkedPerson(2),
          createLinkedPerson(3)
        ],
        true,
        'no error'
      );
      storeState = { linkedPersons: linkedPersonState };
    });
    it('getError() should return the error', () => {
      const results = LinkedPersonQueries.getError(storeState);
      expect(results).toBe(linkedPersonState.error);
    });
    it('getLoaded() should return the loaded boolean', () => {
      const results = LinkedPersonQueries.getLoaded(storeState);
      expect(results).toBe(linkedPersonState.loaded);
    });
    it('getAll() should return an array of the entities in the order from the ids', () => {
      const results = LinkedPersonQueries.getAll(storeState);
      expect(results).toEqual([
        createLinkedPerson(4),
        createLinkedPerson(1),
        createLinkedPerson(2),
        createLinkedPerson(3)
      ]);
    });
    it('getCount() should return number of entities', () => {
      const results = LinkedPersonQueries.getCount(storeState);
      expect(results).toBe(4);
    });
    it('getIds() should return an array with ids in the correct order', () => {
      const results = LinkedPersonQueries.getIds(storeState);
      expect(results).toEqual([4, 1, 2, 3]);
    });
    it('getAllEntities() should return a key value object with all the entities', () => {
      const results = LinkedPersonQueries.getAllEntities(storeState);
      expect(results).toEqual(linkedPersonState.entities);
    });
    it('getByIds() should return an array of the requested entities in order and undefined if the id is not present', () => {
      const results = LinkedPersonQueries.getByIds(storeState, {
        ids: [3, 1, 90, 2]
      });
      expect(results).toEqual([
        createLinkedPerson(3),
        createLinkedPerson(1),
        undefined,
        createLinkedPerson(2)
      ]);
    });
    it('getById() should return the desired entity', () => {
      const results = LinkedPersonQueries.getById(storeState, { id: 2 });
      expect(results).toEqual(createLinkedPerson(2));
    });
    it('getById() should return undefined if the entity is not present', () => {
      const results = LinkedPersonQueries.getById(storeState, { id: 9 });
      expect(results).toBe(undefined);
    });
    it('getLinkedPersonIds() should return number[] of the persons that are linked', () => {
      const results = LinkedPersonQueries.getLinkedPersonIds(storeState);
      expect(results).toEqual([2, 3, 4, 5]);
    });
  });
});
