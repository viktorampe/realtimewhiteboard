import { PersonsLoaded } from './persons.actions';
import {
  initialPersonState,
  PersonEntity,
  personsReducer,
  PersonsState
} from './persons.reducer';

describe('Persons Reducer', () => {
  const getPersonsId = it => it['id'];
  let createPersons;

  beforeEach(() => {
    createPersons = (id: string, name = ''): PersonEntity => ({
      id,
      name: name || `name-${id}`
    });
  });

  describe('valid Persons actions ', () => {
    it('should return set the list of known Persons', () => {
      const personss = [
        createPersons('PRODUCT-AAA'),
        createPersons('PRODUCT-zzz')
      ];
      const action = new PersonsLoaded(personss);
      const result: PersonsState = personsReducer(initialPersonState, action);
      const selId: string = getPersonsId(result.list[1]);

      expect(result.loaded).toBe(true);
      expect(result.list.length).toBe(2);
      expect(selId).toBe('PRODUCT-zzz');
    });
  });

  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any;
      const result = personsReducer(initialPersonState, action);

      expect(result).toBe(initialPersonState);
    });
  });
});
