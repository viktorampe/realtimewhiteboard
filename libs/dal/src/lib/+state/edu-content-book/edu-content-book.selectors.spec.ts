import { EduContentBookQueries } from '.';
import { EduContentBookInterface } from '../../+models';
import { State } from './edu-content-book.reducer';

describe('EduContentBook Selectors', () => {
  function createEduContentBook(id: number): EduContentBookInterface | any {
    return {
      id: id
    };
  }

  function createState(
    eduContentBooks: EduContentBookInterface[],
    loaded: boolean = false,
    diaboloEnabledLoaded: boolean = false,
    diaboloEnabledBookIds: number[] = [],
    error?: any
  ): State {
    return {
      ids: eduContentBooks
        ? eduContentBooks.map(eduContentBook => eduContentBook.id)
        : [],
      entities: eduContentBooks
        ? eduContentBooks.reduce(
            (entityMap, eduContentBook) => ({
              ...entityMap,
              [eduContentBook.id]: eduContentBook
            }),
            {}
          )
        : {},
      loaded: loaded,
      diaboloEnabledLoaded: diaboloEnabledLoaded,
      diaboloEnabledBookIds: diaboloEnabledBookIds,
      error: error
    };
  }

  let eduContentBookState: State;
  let storeState: any;

  describe('EduContentBook Selectors', () => {
    beforeEach(() => {
      eduContentBookState = createState(
        [
          createEduContentBook(4),
          createEduContentBook(1),
          createEduContentBook(2),
          createEduContentBook(3)
        ],
        true,
        false,
        [],
        'no error'
      );
      storeState = { eduContentBooks: eduContentBookState };
    });
    it('getError() should return the error', () => {
      const results = EduContentBookQueries.getError(storeState);
      expect(results).toBe(eduContentBookState.error);
    });
    it('getLoaded() should return the loaded boolean', () => {
      const results = EduContentBookQueries.getLoaded(storeState);
      expect(results).toBe(eduContentBookState.loaded);
    });
    it('getAll() should return an array of the entities in the order from the ids', () => {
      const results = EduContentBookQueries.getAll(storeState);
      expect(results).toEqual([
        createEduContentBook(4),
        createEduContentBook(1),
        createEduContentBook(2),
        createEduContentBook(3)
      ]);
    });
    it('getCount() should return number of entities', () => {
      const results = EduContentBookQueries.getCount(storeState);
      expect(results).toBe(4);
    });
    it('getIds() should return an array with ids in the correct order', () => {
      const results = EduContentBookQueries.getIds(storeState);
      expect(results).toEqual([4, 1, 2, 3]);
    });
    it('getAllEntities() should return a key value object with all the entities', () => {
      const results = EduContentBookQueries.getAllEntities(storeState);
      expect(results).toEqual(eduContentBookState.entities);
    });
    it('getByIds() should return an array of the requested entities in order and undefined if the id is not present', () => {
      const results = EduContentBookQueries.getByIds(storeState, {
        ids: [3, 1, 90, 2]
      });
      expect(results).toEqual([
        createEduContentBook(3),
        createEduContentBook(1),
        undefined,
        createEduContentBook(2)
      ]);
    });
    it('getById() should return the desired entity', () => {
      const results = EduContentBookQueries.getById(storeState, { id: 2 });
      expect(results).toEqual(createEduContentBook(2));
    });
    it('getById() should return undefined if the entity is not present', () => {
      const results = EduContentBookQueries.getById(storeState, { id: 9 });
      expect(results).toBe(undefined);
    });
  });
});
