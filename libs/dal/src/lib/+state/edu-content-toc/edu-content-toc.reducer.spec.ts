import { Update } from '@ngrx/entity';
import { EduContentTocActions } from '.';
import { EduContentTOCInterface } from '../../+models';
import { initialState, reducer, State } from './edu-content-toc.reducer';

/**
 * This file is scaffolded, but needs some special attention:
 * - find and replace 'title' and replace this with a property name of the EduContentToc entity.
 * - set the initial property value via '[title]InitialValue'.
 * - set the updated property value via '[title]UpdatedValue'.
 */
const titleInitialValue = 'initialTitle';
const titleUpdatedValue = 'updatedTitle';

/**
 * Creates a EduContentToc.
 * @param {number} id
 * @returns {EduContentTOCInterface}
 */
function createEduContentToc(
  id: number,
  title: any = titleInitialValue
): EduContentTOCInterface | any {
  return {
    id: id,
    title: title
  };
}

/**
 * Utility to create the edu-content-toc state.
 *
 * @param {EduContentTOCInterface[]} eduContentTocs
 * @param {boolean} [loaded]
 * @param {*} [error]
 * @returns {State}
 */
function createState(
  eduContentTocs: EduContentTOCInterface[],
  loaded: boolean = false,
  error?: any
): State {
  const state: any = {
    ids: eduContentTocs
      ? eduContentTocs.map(eduContentToc => eduContentToc.id)
      : [],
    entities: eduContentTocs
      ? eduContentTocs.reduce(
          (entityMap, eduContentToc) => ({
            ...entityMap,
            [eduContentToc.id]: eduContentToc
          }),
          {}
        )
      : {},
    loaded: loaded
  };
  if (error !== undefined) state.error = error;
  return state;
}

describe('EduContentTocs Reducer', () => {
  let bookId = 1;
  let eduContentTocs: EduContentTOCInterface[];
  beforeEach(() => {
    eduContentTocs = [
      createEduContentToc(1),
      createEduContentToc(2),
      createEduContentToc(3)
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
    it('should load all eduContentTocs for a bookId', () => {
      const action = new EduContentTocActions.LoadEduContentTocsForBook({
        bookId
      });
      const result = reducer(initialState, action);
      expect(result).toEqual(createState(eduContentTocs, true));
    });

    it('should error', () => {
      const error = 'Something went wrong';
      const action = new EduContentTocActions.EduContentTocsLoadError(error);
      const result = reducer(initialState, action);
      expect(result).toEqual(createState([], false, error));
    });
  });

  describe('add actions', () => {
    it('should add one eduContentToc', () => {
      const eduContentToc = eduContentTocs[0];
      const action = new EduContentTocActions.AddEduContentToc({
        eduContentToc
      });

      const result = reducer(initialState, action);
      expect(result).toEqual(createState([eduContentToc], false));
    });

    it('should add multiple eduContentTocs', () => {
      const action = new EduContentTocActions.AddEduContentTocsForBook({
        bookId,
        eduContentTocs
      });
      const result = reducer(initialState, action);

      expect(result).toEqual(createState(eduContentTocs, false));
    });
  });
  describe('upsert actions', () => {
    it('should upsert one eduContentToc', () => {
      const originalEduContentToc = eduContentTocs[0];

      const startState = reducer(
        initialState,
        new EduContentTocActions.AddEduContentToc({
          eduContentToc: originalEduContentToc
        })
      );

      const updatedEduContentToc = createEduContentToc(
        eduContentTocs[0].id,
        'test'
      );

      const action = new EduContentTocActions.UpsertEduContentToc({
        eduContentToc: updatedEduContentToc
      });

      const result = reducer(startState, action);

      expect(result.entities[updatedEduContentToc.id]).toEqual(
        updatedEduContentToc
      );
    });

    it('should upsert many eduContentTocs', () => {
      const startState = createState(eduContentTocs);

      const eduContentTocsToInsert = [
        createEduContentToc(1),
        createEduContentToc(2),
        createEduContentToc(3),
        createEduContentToc(4)
      ];
      const action = new EduContentTocActions.UpsertEduContentTocs({
        eduContentTocs: eduContentTocsToInsert
      });

      const result = reducer(startState, action);

      expect(result).toEqual(createState(eduContentTocsToInsert));
    });
  });

  describe('update actions', () => {
    it('should update an eduContentToc', () => {
      const eduContentToc = eduContentTocs[0];
      const startState = createState([eduContentToc]);
      const update: Update<EduContentTOCInterface> = {
        id: 1,
        changes: {
          title: titleUpdatedValue
        }
      };
      const action = new EduContentTocActions.UpdateEduContentToc({
        eduContentToc: update
      });
      const result = reducer(startState, action);
      expect(result).toEqual(
        createState([createEduContentToc(1, titleUpdatedValue)])
      );
    });

    it('should update multiple eduContentTocs', () => {
      const startState = createState(eduContentTocs);
      const updates: Update<EduContentTOCInterface>[] = [
        {
          id: 1,
          changes: {
            title: titleUpdatedValue
          }
        },
        {
          id: 2,
          changes: {
            title: titleUpdatedValue
          }
        }
      ];
      const action = new EduContentTocActions.UpdateEduContentTocs({
        eduContentTocs: updates
      });
      const result = reducer(startState, action);

      expect(result).toEqual(
        createState([
          createEduContentToc(1, titleUpdatedValue),
          createEduContentToc(2, titleUpdatedValue),
          eduContentTocs[2]
        ])
      );
    });
  });

  describe('delete actions', () => {
    it('should delete one eduContentToc ', () => {
      const eduContentToc = eduContentTocs[0];
      const startState = createState([eduContentToc]);
      const action = new EduContentTocActions.DeleteEduContentToc({
        id: eduContentToc.id
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([]));
    });

    it('should delete multiple eduContentTocs', () => {
      const startState = createState(eduContentTocs);
      const action = new EduContentTocActions.DeleteEduContentTocs({
        ids: [eduContentTocs[0].id, eduContentTocs[1].id]
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([eduContentTocs[2]]));
    });
  });

  describe('clear action', () => {
    it('should clear the eduContentTocs collection', () => {
      const startState = createState(
        eduContentTocs,
        true,
        'something went wrong'
      );
      const action = new EduContentTocActions.ClearEduContentTocs();
      const result = reducer(startState, action);
      expect(result).toEqual(createState([], true, 'something went wrong'));
    });
  });
});
