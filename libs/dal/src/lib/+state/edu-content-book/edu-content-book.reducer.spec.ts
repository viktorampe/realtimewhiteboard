import { Update } from '@ngrx/entity';
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
      expect(result).toEqual(createState([], false, error));
    });
  });

  describe('add actions', () => {
    it('should add one eduContentBook', () => {
      const eduContentBook = eduContentBooks[0];
      const action = new EduContentBookActions.AddEduContentBook({
        eduContentBook
      });

      const result = reducer(initialState, action);
      expect(result).toEqual(createState([eduContentBook], false));
    });

    it('should add multiple eduContentBooks', () => {
      const action = new EduContentBookActions.AddEduContentBooks({
        eduContentBooks
      });
      const result = reducer(initialState, action);

      expect(result).toEqual(createState(eduContentBooks, false));
    });
  });
  describe('upsert actions', () => {
    it('should upsert one eduContentBook', () => {
      const originalEduContentBook = eduContentBooks[0];

      const startState = reducer(
        initialState,
        new EduContentBookActions.AddEduContentBook({
          eduContentBook: originalEduContentBook
        })
      );

      const updatedEduContentBook = createEduContentBook(
        eduContentBooks[0].id,
        'test'
      );

      const action = new EduContentBookActions.UpsertEduContentBook({
        eduContentBook: updatedEduContentBook
      });

      const result = reducer(startState, action);

      expect(result.entities[updatedEduContentBook.id]).toEqual(
        updatedEduContentBook
      );
    });

    it('should upsert many eduContentBooks', () => {
      const startState = createState(eduContentBooks);

      const eduContentBooksToInsert = [
        createEduContentBook(1),
        createEduContentBook(2),
        createEduContentBook(3),
        createEduContentBook(4)
      ];
      const action = new EduContentBookActions.UpsertEduContentBooks({
        eduContentBooks: eduContentBooksToInsert
      });

      const result = reducer(startState, action);

      expect(result).toEqual(createState(eduContentBooksToInsert));
    });
  });

  describe('update actions', () => {
    it('should update an eduContentBook', () => {
      const eduContentBook = eduContentBooks[0];
      const startState = createState([eduContentBook]);
      const update: Update<EduContentBookInterface> = {
        id: 1,
        changes: {
          ISBN: ISBNUpdatedValue
        }
      };
      const action = new EduContentBookActions.UpdateEduContentBook({
        eduContentBook: update
      });
      const result = reducer(startState, action);
      expect(result).toEqual(
        createState([createEduContentBook(1, ISBNUpdatedValue)])
      );
    });

    it('should update multiple eduContentBooks', () => {
      const startState = createState(eduContentBooks);
      const updates: Update<EduContentBookInterface>[] = [
        {
          id: 1,
          changes: {
            ISBN: ISBNUpdatedValue
          }
        },
        {
          id: 2,
          changes: {
            ISBN: ISBNUpdatedValue
          }
        }
      ];
      const action = new EduContentBookActions.UpdateEduContentBooks({
        eduContentBooks: updates
      });
      const result = reducer(startState, action);

      expect(result).toEqual(
        createState([
          createEduContentBook(1, ISBNUpdatedValue),
          createEduContentBook(2, ISBNUpdatedValue),
          eduContentBooks[2]
        ])
      );
    });
  });

  describe('delete actions', () => {
    it('should delete one eduContentBook ', () => {
      const eduContentBook = eduContentBooks[0];
      const startState = createState([eduContentBook]);
      const action = new EduContentBookActions.DeleteEduContentBook({
        id: eduContentBook.id
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([]));
    });

    it('should delete multiple eduContentBooks', () => {
      const startState = createState(eduContentBooks);
      const action = new EduContentBookActions.DeleteEduContentBooks({
        ids: [eduContentBooks[0].id, eduContentBooks[1].id]
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([eduContentBooks[2]]));
    });
  });

  describe('clear action', () => {
    it('should clear the eduContentBooks collection', () => {
      const startState = createState(
        eduContentBooks,
        true,
        'something went wrong'
      );
      const action = new EduContentBookActions.ClearEduContentBooks();
      const result = reducer(startState, action);
      expect(result).toEqual(createState([], true, 'something went wrong'));
    });
  });
});
