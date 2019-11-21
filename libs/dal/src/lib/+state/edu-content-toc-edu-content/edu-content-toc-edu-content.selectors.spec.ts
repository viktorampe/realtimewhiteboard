import { EduContentTocEduContentQueries } from '.';
import {
  EduContentTOCEduContentInterface,
  EduContentTypeEnum
} from '../../+models';
import { State } from './edu-content-toc-edu-content.reducer';

describe('EduContentTocEduContent Selectors', () => {
  function createEduContentTocEduContent(
    id: string,
    eduContentTOCId: number,
    eduContentId: number,
    type: EduContentTypeEnum = EduContentTypeEnum.EXERCISE
  ): EduContentTOCEduContentInterface | any {
    return {
      id,
      eduContentTOCId,
      eduContentId,
      type
    };
  }

  function createState(
    eduContentTocEduContents: EduContentTOCEduContentInterface[],
    loadedBooks: number[],
    error?: any
  ): State {
    return {
      ids: eduContentTocEduContents
        ? eduContentTocEduContents.map(
            eduContentTocEduContent => eduContentTocEduContent.id
          )
        : [],
      entities: eduContentTocEduContents
        ? eduContentTocEduContents.reduce(
            (entityMap, eduContentTocEduContent) => ({
              ...entityMap,
              [eduContentTocEduContent.id]: eduContentTocEduContent
            }),
            {}
          )
        : {},
      loadedBooks,
      error: error
    };
  }

  let eduContentTocEduContentState: State;
  let storeState: any;

  describe('EduContentTocEduContent Selectors', () => {
    beforeEach(() => {
      eduContentTocEduContentState = createState(
        [
          createEduContentTocEduContent('1-4', 1, 4),
          createEduContentTocEduContent('1-1', 1, 1),
          createEduContentTocEduContent('1-2', 1, 2),
          createEduContentTocEduContent('1-3', 1, 3, EduContentTypeEnum.FILE),
          createEduContentTocEduContent('1-5', 1, 5, EduContentTypeEnum.BOEKE),
          createEduContentTocEduContent('2-3', 2, 3)
        ],
        [1],
        'no error'
      );
      storeState = { eduContentTocEduContents: eduContentTocEduContentState };
    });

    it('getError() should return the error', () => {
      const results = EduContentTocEduContentQueries.getError(storeState);
      expect(results).toBe(eduContentTocEduContentState.error);
    });

    it('getAll() should return an array of the entities in the order from the ids', () => {
      const results = EduContentTocEduContentQueries.getAll(storeState);
      expect(results).toEqual([
        createEduContentTocEduContent('1-4', 1, 4),
        createEduContentTocEduContent('1-1', 1, 1),
        createEduContentTocEduContent('1-2', 1, 2),
        createEduContentTocEduContent('1-3', 1, 3, EduContentTypeEnum.FILE),
        createEduContentTocEduContent('1-5', 1, 5, EduContentTypeEnum.BOEKE),
        createEduContentTocEduContent('2-3', 2, 3)
      ]);
    });

    it('getAllByType() should return an array of the entities filtered by type', () => {
      const results = EduContentTocEduContentQueries.getAllByType(storeState, {
        type: EduContentTypeEnum.EXERCISE
      });
      expect(results).toEqual([
        createEduContentTocEduContent('1-4', 1, 4),
        createEduContentTocEduContent('1-1', 1, 1),
        createEduContentTocEduContent('1-2', 1, 2),
        createEduContentTocEduContent('2-3', 2, 3)
      ]);
    });

    it('getAllByTypeAndToc() should return an array of the entities filtered by type', () => {
      const props = { type: EduContentTypeEnum.FILE, tocId: 1 };
      const results = EduContentTocEduContentQueries.getAllByTypeAndToc(
        storeState,
        props
      );
      expect(results).toEqual([
        createEduContentTocEduContent('1-3', 1, 3, EduContentTypeEnum.FILE)
      ]);
    });
    it('getCount() should return number of entities', () => {
      const results = EduContentTocEduContentQueries.getCount(storeState);
      expect(results).toBe(6);
    });

    it('getCountByTypeAndToc()  should return number of entities filtered by type', () => {
      const props = { type: EduContentTypeEnum.FILE, tocId: 1 };
      const results = EduContentTocEduContentQueries.getCountByTypeAndToc(
        storeState,
        props
      );
      expect(results).toBe(1);
    });

    it('getAllEntities() should return a key value object with all the entities', () => {
      const results = EduContentTocEduContentQueries.getAllEntities(storeState);
      expect(results).toEqual(eduContentTocEduContentState.entities);
    });

    it('getIds() should return an array with ids in the correct order', () => {
      const results = EduContentTocEduContentQueries.getIds(storeState);
      expect(results).toEqual(['1-4', '1-1', '1-2', '1-3', '1-5', '2-3']);
    });

    it('getByIds() should return an array of the requested entities in order and undefined if the id is not present', () => {
      const results = EduContentTocEduContentQueries.getByIds(storeState, {
        ids: ['1-3', '1-1', '2-90', '1-2']
      });
      expect(results).toEqual([
        createEduContentTocEduContent('1-3', 1, 3, EduContentTypeEnum.FILE),
        createEduContentTocEduContent('1-1', 1, 1),
        undefined,
        createEduContentTocEduContent('1-2', 1, 2)
      ]);
    });

    it('getById() should return the desired entity', () => {
      const results = EduContentTocEduContentQueries.getById(storeState, {
        id: '1-2'
      });
      expect(results).toEqual(createEduContentTocEduContent('1-2', 1, 2));
    });

    it('getById() should return undefined if the entity is not present', () => {
      const results = EduContentTocEduContentQueries.getById(storeState, {
        id: '9'
      });
      expect(results).toBe(undefined);
    });

    describe('isBookLoaded', () => {
      it('should return false if the book has not been loaded', () => {
        const results = EduContentTocEduContentQueries.isBookLoaded(
          storeState,
          { bookId: 9 }
        );
        expect(results).toBeFalsy();
      });

      it('should return true if the book has not been loaded', () => {
        const results = EduContentTocEduContentQueries.isBookLoaded(
          storeState,
          { bookId: 1 }
        );
        expect(results).toBeTruthy();
      });
    });
  });
});
