import { EduContentTocQueries } from '.';
import { EduContentTocInterface } from '../../+models';
import { State } from './edu-content-toc.reducer';

describe('EduContentToc Selectors', () => {
  function createEduContentToc(id: number): EduContentTocInterface | any {
    return {
      id: id
    };
  }

  function createState(
    eduContentTocs: EduContentTocInterface[],
    loaded: boolean = false,
    error?: any
  ): State {
    return {
      ids: eduContentTocs ? eduContentTocs.map(eduContentToc => eduContentToc.id) : [],
      entities: eduContentTocs
        ? eduContentTocs.reduce(
            (entityMap, eduContentToc) => ({
              ...entityMap,
              [eduContentToc.id]: eduContentToc
            }),
            {}
          )
        : {},
      loaded: loaded,
      error: error
    };
  }

  let eduContentTocState: State;
  let storeState: any;

  describe('EduContentToc Selectors', () => {
    beforeEach(() => {
      eduContentTocState = createState(
        [
          createEduContentToc(4),
          createEduContentToc(1),
          createEduContentToc(2),
          createEduContentToc(3)
        ],
        true,
        'no error'
      );
      storeState = { eduContentTocs: eduContentTocState };
    });
    it('getError() should return the error', () => {
      const results = EduContentTocQueries.getError(storeState);
      expect(results).toBe(eduContentTocState.error);
    });
    it('getLoaded() should return the loaded boolean', () => {
      const results = EduContentTocQueries.getLoaded(storeState);
      expect(results).toBe(eduContentTocState.loaded);
    });
    it('getAll() should return an array of the entities in the order from the ids', () => {
      const results = EduContentTocQueries.getAll(storeState);
      expect(results).toEqual([
        createEduContentToc(4),
        createEduContentToc(1),
        createEduContentToc(2),
        createEduContentToc(3)
      ]);
    });
    it('getCount() should return number of entities', () => {
      const results = EduContentTocQueries.getCount(storeState);
      expect(results).toBe(4);
    });
    it('getIds() should return an array with ids in the correct order', () => {
      const results = EduContentTocQueries.getIds(storeState);
      expect(results).toEqual([4, 1, 2, 3]);
    });
    it('getAllEntities() should return a key value object with all the entities', () => {
      const results = EduContentTocQueries.getAllEntities(storeState);
      expect(results).toEqual(eduContentTocState.entities);
    });
    it('getByIds() should return an array of the requested entities in order and undefined if the id is not present', () => {
      const results = EduContentTocQueries.getByIds(storeState, {
        ids: [3, 1, 90, 2]
      });
      expect(results).toEqual([
        createEduContentToc(3),
        createEduContentToc(1),
        undefined,
        createEduContentToc(2)
      ]);
    });
    it('getById() should return the desired entity', () => {
      const results = EduContentTocQueries.getById(storeState, { id: 2 });
      expect(results).toEqual(createEduContentToc(2));
    });
    it('getById() should return undefined if the entity is not present', () => {
      const results = EduContentTocQueries.getById(storeState, { id: 9 });
      expect(results).toBe(undefined);
    });
  });
});
