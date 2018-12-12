import { PersonQueries } from '.';
import { PersonInterface } from '../../+models';
import { State } from './person.reducer';

describe('Person Selectors', () => {
  function createPerson(id: number): PersonInterface | any {
    return {
      id: id
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
        [createPerson(4), createPerson(1), createPerson(2), createPerson(3)],
        true,
        'no error'
      );
      storeState = { persons: personState };
    });
    it('getError() should return the error', () => {
      const results = PersonQueries.getError(storeState);
      expect(results).toBe(personState.error);
    });
    it('getLoaded() should return the loaded boolean', () => {
      const results = PersonQueries.getLoaded(storeState);
      expect(results).toBe(personState.loaded);
    });
    it('getAll() should return an array of the entities in the order from the ids', () => {
      const results = PersonQueries.getAll(storeState);
      expect(results).toEqual([
        createPerson(4),
        createPerson(1),
        createPerson(2),
        createPerson(3)
      ]);
    });
    it('getCount() should return number of entities', () => {
      const results = PersonQueries.getCount(storeState);
      expect(results).toBe(4);
    });
    it('getIds() should return an array with ids in the correct order', () => {
      const results = PersonQueries.getIds(storeState);
      expect(results).toEqual([4, 1, 2, 3]);
    });
    it('getAllEntities() should return a key value object with all the entities', () => {
      const results = PersonQueries.getAllEntities(storeState);
      expect(results).toEqual(personState.entities);
    });
    it('getByIds() should return an array of the requested entities in order and undefined if the id is not present', () => {
      const results = PersonQueries.getByIds(storeState, {
        ids: [3, 1, 90, 2]
      });
      expect(results).toEqual([
        createPerson(3),
        createPerson(1),
        undefined,
        createPerson(2)
      ]);
    });
    it('getById() should return the desired entity', () => {
      const results = PersonQueries.getById(storeState, { id: 2 });
      expect(results).toEqual(createPerson(2));
    });
    it('getById() should return undefined if the entity is not present', () => {
      const results = PersonQueries.getById(storeState, { id: 9 });
      expect(results).toBe(undefined);
    });
  });
});
