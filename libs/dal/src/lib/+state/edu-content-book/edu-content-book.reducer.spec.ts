import { EduContentBookActions } from '.';
import { EduContentBookInterface } from '../../+models';
import { initialState, reducer, State } from './edu-content-book.reducer';

/**
 * This file is scaffolded, but needs some special attention:
 * - find and replace 'ISBN' and replace this with a property name of the EduContentBook entity.
 * - set the initial property value via '[ISBN]InitialValue'.
 * - set the updated property value via '[ISBN]UpdatedValue'.
 */
const ISBNInitialValue = 'one';
const ISBNUpdatedValue = `now it's two`;

/**
 * Creates a EduContentBook.
 * @param {number} id
 * @returns {EduContentBookInterface}
 */
function createEduContentBook(
  id: number,
  ISBN: any = ISBNInitialValue
): EduContentBookInterface | any {
  return {
    id: id,
    ISBN: ISBN
  };
}

/**
 * Utility to create the edu-content-book state.
 *
 * @param {EduContentBookInterface[]} eduContentBooks
 * @param {boolean} [loaded]
 * @param {*} [error]
 * @returns {State}
 */
function createState(
  eduContentBooks: EduContentBookInterface[],
  loaded: boolean = false,
  error?: any
): State {
  const state: any = {
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
    loaded: loaded
  };
  if (error !== undefined) state.error = error;
  return state;
}

describe('EduContentBooks Reducer', () => {
  let eduContentBooks: EduContentBookInterface[];
  beforeEach(() => {
    eduContentBooks = [
      createEduContentBook(1),
      createEduContentBook(2),
      createEduContentBook(3)
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
    it('should load all eduContentBooks', () => {
      const action = new EduContentBookActions.EduContentBooksLoaded({
        eduContentBooks
      });
      const result = reducer(initialState, action);
      expect(result).toEqual(createState(eduContentBooks, true));
    });

    it('should error', () => {
      const error = 'Something went wrong';
      const action = new EduContentBookActions.EduContentBooksLoadError(error);
      const result = reducer(initialState, action);
      expect(result).toEqual(createState([], false, 'Something went wrong'));
    });
  });

  describe('clear action', () => {
    it('should clear the eduContentBooks collection', () => {
      const startState = createState(eduContentBooks, true, false);
      const action = new EduContentBookActions.ClearEduContentBooks();
      const result = reducer(startState, action);
      expect(result).toEqual(createState([], true, false));
    });
  });
});
