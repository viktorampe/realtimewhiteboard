import { EduContentTocEduContentQueries } from '.';
import { EduContentTOCEduContentInterface } from '../../+models';
import { State } from './edu-content-toc-edu-content.reducer';

describe('EduContentTocEduContent Selectors', () => {
  function createEduContentTocEduContent(
    id: number
  ): EduContentTOCEduContentInterface | any {
    return {
      id: id
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
          createEduContentTocEduContent(4),
          createEduContentTocEduContent(1),
          createEduContentTocEduContent(2),
          createEduContentTocEduContent(3)
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

    it('getIds() should return an array with ids in the correct order', () => {
      const results = EduContentTocEduContentQueries.getIds(storeState);
      expect(results).toEqual([4, 1, 2, 3]);
    });

    it('getByIds() should return an array of the requested entities in order and undefined if the id is not present', () => {
      const results = EduContentTocEduContentQueries.getByIds(storeState, {
        ids: [3, 1, 90, 2]
      });
      expect(results).toEqual([
        createEduContentTocEduContent(3),
        createEduContentTocEduContent(1),
        undefined,
        createEduContentTocEduContent(2)
      ]);
    });

    it('getById() should return the desired entity', () => {
      const results = EduContentTocEduContentQueries.getById(storeState, {
        id: 2
      });
      expect(results).toEqual(createEduContentTocEduContent(2));
    });

    it('getById() should return undefined if the entity is not present', () => {
      const results = EduContentTocEduContentQueries.getById(storeState, {
        id: 9
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
