import { EduContentQueries } from '.';
import {
  EduContentInterface,
  EduContentMetadataInterface
} from '../../+models';
import { State } from './edu-content.reducer';

describe('EduContent Selectors', () => {
  function createEduContent(
    id: number,
    options?: {
      publishedEduContentMetadata?: Partial<EduContentMetadataInterface>;
      type?: 'boek-e' | 'other';
    }
  ): EduContentInterface | any {
    const data: EduContentInterface | any = {
      id: id
    };
    if (options) {
      if (options.publishedEduContentMetadata)
        data.publishedEduContentMetadata = options.publishedEduContentMetadata;
      if (options.type) data.type = options.type;
    }
    return data;
  }

  function createState(
    eduContents: EduContentInterface[],
    loaded: boolean = false,
    error?: any
  ): State {
    return {
      ids: eduContents ? eduContents.map(eduContent => eduContent.id) : [],
      entities: eduContents
        ? eduContents.reduce(
            (entityMap, eduContent) => ({
              ...entityMap,
              [eduContent.id]: eduContent
            }),
            {}
          )
        : {},
      loaded: loaded,
      error: error
    };
  }

  let eduContentState: State;
  let storeState: any;

  describe('EduContent Selectors', () => {
    beforeEach(() => {
      eduContentState = createState(
        [
          createEduContent(4),
          createEduContent(1),
          createEduContent(2),
          createEduContent(3)
        ],
        true,
        'no error'
      );
      storeState = { eduContents: eduContentState };
    });
    it('getError() should return the error', () => {
      const results = EduContentQueries.getError(storeState);
      expect(results).toBe(eduContentState.error);
    });
    it('getLoaded() should return the loaded boolean', () => {
      const results = EduContentQueries.getLoaded(storeState);
      expect(results).toBe(eduContentState.loaded);
    });
    it('getAll() should return an array of the entities in the order from the ids', () => {
      const results = EduContentQueries.getAll(storeState);
      expect(results).toEqual([
        createEduContent(4),
        createEduContent(1),
        createEduContent(2),
        createEduContent(3)
      ]);
    });
    it('getCount() should return number of entities', () => {
      const results = EduContentQueries.getCount(storeState);
      expect(results).toBe(4);
    });
    it('getIds() should return an array with ids in the correct order', () => {
      const results = EduContentQueries.getIds(storeState);
      expect(results).toEqual([4, 1, 2, 3]);
    });
    it('getAllEntities() should return a key value object with all the entities', () => {
      const results = EduContentQueries.getAllEntities(storeState);
      expect(results).toEqual(eduContentState.entities);
    });
    it('getByIds() should return an array of the requested entities in order and undefined if the id is not present', () => {
      const results = EduContentQueries.getByIds(storeState, {
        ids: [3, 1, 90, 2]
      });
      expect(results).toEqual([
        createEduContent(3),
        createEduContent(1),
        undefined,
        createEduContent(2)
      ]);
    });
    it('getById() should return the desired entity', () => {
      const results = EduContentQueries.getById(storeState, { id: 2 });
      expect(results).toEqual(createEduContent(2));
    });
    it('getById() should return undefined if the entity is not present', () => {
      const results = EduContentQueries.getById(storeState, { id: 9 });
      expect(results).toBe(undefined);
    });
    it('getBookeByBoekId () should return the boeke eduContent item for a given eduContentBookId', () => {
      eduContentState = createState(
        [
          createEduContent(4, { publishedEduContentMetadata: {} }),
          createEduContent(1, {
            publishedEduContentMetadata: { eduContentBookId: 1 },
            type: 'boek-e'
          }),
          createEduContent(2, {
            publishedEduContentMetadata: { eduContentBookId: 1 },
            type: 'other'
          }),
          createEduContent(3, {
            publishedEduContentMetadata: { eduContentBookId: 2 },
            type: 'boek-e'
          })
        ],
        true,
        'no error'
      );
      storeState = { eduContents: eduContentState };
      const results = EduContentQueries.getBookeByBoekId(storeState, {
        bookId: 1
      });
      expect(results).toEqual(
        createEduContent(1, {
          publishedEduContentMetadata: { eduContentBookId: 1 },
          type: 'boek-e'
        })
      );
    });
  });
});
