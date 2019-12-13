import { LinkedPersonQueries } from '.';
import { PersonInterface } from '../../+models';
import { State } from './linked-person.reducer';

describe('Person Selectors', () => {
  function createPerson(id: number, type: string): PersonInterface | any {
    return {
      id: id,
      type: type
    };
  }

  function createState(
    persons: PersonInterface[],
    loaded: boolean = false,
    error?: any
  ): State {
    return {
      ids: persons ? persons.map(person => person.id) : [],
      entities: persons
        ? persons.reduce(
            (entityMap, person) => ({
              ...entityMap,
              [person.id]: person
            }),
            {}
          )
        : {},
      loaded: loaded,
      error: error
    };
  }

  let personState: State;
  let storeState: any;

  describe('Person Selectors', () => {
    beforeEach(() => {
      personState = createState(
        [
          createPerson(4, 'student'),
          createPerson(1, 'student'),
          createPerson(2, 'student'),
          createPerson(3, 'teacher')
        ],
        true,
        'no error'
      );
      storeState = { linkedPersons: personState };
    });
    it('getError() should return the error', () => {
      const results = LinkedPersonQueries.getError(storeState);
      expect(results).toBe(personState.error);
    });
    it('getLoaded() should return the loaded boolean', () => {
      const results = LinkedPersonQueries.getLoaded(storeState);
      expect(results).toBe(personState.loaded);
    });
    it('getAll() should return an array of the entities in the order from the ids', () => {
      const results = LinkedPersonQueries.getAll(storeState);
      expect(results).toEqual([
        createPerson(4, 'student'),
        createPerson(1, 'student'),
        createPerson(2, 'student'),
        createPerson(3, 'teacher')
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
      expect(results).toEqual(personState.entities);
    });
    it('getByIds() should return an array of the requested entities in order and undefined if the id is not present', () => {
      const results = LinkedPersonQueries.getByIds(storeState, {
        ids: [3, 1, 90, 2]
      });
      expect(results).toEqual([
        createPerson(3, 'teacher'),
        createPerson(1, 'student'),
        undefined,
        createPerson(2, 'student')
      ]);
    });
    it('getById() should return the desired entity', () => {
      const results = LinkedPersonQueries.getById(storeState, { id: 2 });
      expect(results).toEqual(createPerson(2, 'student'));
    });
    it('getById() should return undefined if the entity is not present', () => {
      const results = LinkedPersonQueries.getById(storeState, { id: 9 });
      expect(results).toBe(undefined);
    });
    it('getStudents() should return filtered linkedPersons on student type', () => {
      const results = LinkedPersonQueries.getStudents(storeState);

      expect(results).toEqual([
        createPerson(4, 'student'),
        createPerson(1, 'student'),
        createPerson(2, 'student')
      ]);
    });
  });
});
