import { Entity, PersonsState } from './persons.reducer';
import { personsQuery } from './persons.selectors';

describe('Persons Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getPersonsId = it => it['id'];

  let storeState;

  beforeEach(() => {
    const createPersons = (id: string, name = ''): Entity => ({
      id,
      name: name || `name-${id}`
    });
    storeState = {
      persons: {
        list: [
          createPersons('PRODUCT-AAA'),
          createPersons('PRODUCT-BBB'),
          createPersons('PRODUCT-CCC')
        ],
        selectedId: 'PRODUCT-BBB',
        error: ERROR_MSG,
        loaded: true
      }
    };
  });

  describe('Persons Selectors', () => {
    it('getAllPersons() should return the list of Persons', () => {
      const results = personsQuery.getAllPersons(storeState);
      const selId = getPersonsId(results[1]);

      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });

    it('getSelectedPersons() should return the selected Entity', () => {
      const result = personsQuery.getSelectedPersons(storeState);
      const selId = getPersonsId(result);

      expect(selId).toBe('PRODUCT-BBB');
    });

    it("getLoaded() should return the current 'loaded' status", () => {
      const result = personsQuery.getLoaded(storeState);

      expect(result).toBe(true);
    });

    it("getError() should return the current 'error' storeState", () => {
      const result = personsQuery.getError(storeState);

      expect(result).toBe(ERROR_MSG);
    });
  });
});
