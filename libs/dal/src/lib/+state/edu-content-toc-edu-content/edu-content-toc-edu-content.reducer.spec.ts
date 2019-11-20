import { EduContentTocEduContentActions } from '.';
import { EduContentTOCEduContentInterface } from '../../+models';
import {
  initialState,
  reducer,
  State
} from './edu-content-toc-edu-content.reducer';

/**
 * Creates a EduContentTocEduContent.
 * @param {number} id
 * @returns {EduContentTOCEduContentInterface}
 */
function createEduContentTocEduContent(
  id: number
): EduContentTOCEduContentInterface | any {
  return {
    id: id // only track ids
  };
}

/**
 * Utility to create the edu-content-toc-edu-content state.
 *
 * @param {EduContentTOCEduContentInterface[]} eduContentTocEduContents
 * @param {boolean} [loaded]
 * @param {*} [error]
 * @returns {State}
 */
function createState(
  eduContentTocEduContents: EduContentTOCEduContentInterface[],
  loadedBooks: number[],
  error?: any
): State {
  const state: any = {
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
    loadedBooks
  };
  if (error !== undefined) state.error = error;
  return state;
}

describe('EduContentTocEduContents Reducer', () => {
  let bookId: number;
  let eduContentTocEduContents: EduContentTOCEduContentInterface[];
  beforeEach(() => {
    bookId = 1;
    eduContentTocEduContents = [
      createEduContentTocEduContent(1),
      createEduContentTocEduContent(2),
      createEduContentTocEduContent(3)
    ];
  });

  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });

  describe('loaded action', () => {
    it('should error', () => {
      const error = 'Something went wrong';
      const action = new EduContentTocEduContentActions.EduContentTocEduContentsLoadError(
        error
      );
      const result = reducer(initialState, action);
      expect(result).toEqual(createState([], [], error));
    });
  });

  describe('add actions', () => {
    it('should add a book to the loadedBooks', () => {
      const action = new EduContentTocEduContentActions.AddLoadedBook({
        bookId
      });

      const result = reducer(initialState, action);

      expect(result).toEqual(createState([], [bookId]));
    });
  });
});
