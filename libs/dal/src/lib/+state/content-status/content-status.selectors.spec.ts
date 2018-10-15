import { ContentStatusQueries } from '.';
import { ContentStatusInterface } from '../../+models';
import { State } from './content-status.reducer';

describe('ContentStatus Selectors', () => {
  function createContentStatus(id: number): ContentStatusInterface | any {
    return {
      id: id
    };
  }

  function createState(
    contentStatuses: ContentStatusInterface[],
    loaded: boolean = false,
    error?: any
  ): State {
    return {
      ids: contentStatuses ? contentStatuses.map(contentStatus => contentStatus.id) : [],
      entities: contentStatuses
        ? contentStatuses.reduce(
            (entityMap, contentStatus) => ({
              ...entityMap,
              [contentStatus.id]: contentStatus
            }),
            {}
          )
        : {},
      loaded: loaded,
      error: error
    };
  }

  let contentStatusState: State;
  let storeState: any;

  describe('ContentStatus Selectors', () => {
    beforeEach(() => {
      contentStatusState = createState(
        [
          createContentStatus(4),
          createContentStatus(1),
          createContentStatus(2),
          createContentStatus(3)
        ],
        true,
        'no error'
      );
      storeState = { contentStatuses: contentStatusState };
    });
    it('getError() should return the error', () => {
      const results = ContentStatusQueries.getError(storeState);
      expect(results).toBe(contentStatusState.error);
    });
    it('getLoaded() should return the loaded boolean', () => {
      const results = ContentStatusQueries.getLoaded(storeState);
      expect(results).toBe(contentStatusState.loaded);
    });
    it('getAll() should return an array of the entities in the order from the ids', () => {
      const results = ContentStatusQueries.getAll(storeState);
      expect(results).toEqual([
        createContentStatus(4),
        createContentStatus(1),
        createContentStatus(2),
        createContentStatus(3)
      ]);
    });
    it('getCount() should return number of entities', () => {
      const results = ContentStatusQueries.getCount(storeState);
      expect(results).toBe(4);
    });
    it('getIds() should return an array with ids in the correct order', () => {
      const results = ContentStatusQueries.getIds(storeState);
      expect(results).toEqual([4, 1, 2, 3]);
    });
    it('getAllEntities() should return a key value object with all the entities', () => {
      const results = ContentStatusQueries.getAllEntities(storeState);
      expect(results).toEqual(contentStatusState.entities);
    });
    it('getByIds() should return an array of the requested entities in order and undefined if the id is not present', () => {
      const results = ContentStatusQueries.getByIds(storeState, {
        ids: [3, 1, 90, 2]
      });
      expect(results).toEqual([
        createContentStatus(3),
        createContentStatus(1),
        undefined,
        createContentStatus(2)
      ]);
    });
    it('getById() should return the desired entity', () => {
      const results = ContentStatusQueries.getById(storeState, { id: 2 });
      expect(results).toEqual(createContentStatus(2));
    });
    it('getById() should return undefined if the entity is not present', () => {
      const results = ContentStatusQueries.getById(storeState, { id: 9 });
      expect(results).toBe(undefined);
    });
  });
});
