// file.only
import { Update } from '@ngrx/entity';
import { EduContentActions } from '.';
import { EduContentFixture } from '../../+fixtures';
import { EduContentInterface } from '../../+models';
import {
  initialState,
  reducer,
  sortEduContent,
  State
} from './edu-content.reducer';

const typeInitialValue = 'boeke';
const typeUpdatedValue = 'file';

/**
 * Creates a EduContent.
 * @param {number} id
 * @returns {EduContentInterface}
 */
function createEduContent(
  id: number,
  type: any = typeInitialValue
): EduContentInterface | any {
  return {
    id: id,
    type: type
  };
}

/**
 * Utility to create the edu-content state.
 *
 * @param {EduContentInterface[]} eduContents
 * @param {boolean} [loaded]
 * @param {*} [error]
 * @returns {State}
 */
function createState(
  eduContents: EduContentInterface[],
  loaded: boolean = false,
  error?: any
): State {
  const state: any = {
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
    loaded: loaded
  };
  if (error !== undefined) state.error = error;
  return state;
}

describe('EduContents Reducer', () => {
  let eduContents: EduContentInterface[];
  beforeEach(() => {
    eduContents = [
      createEduContent(1),
      createEduContent(2),
      createEduContent(3)
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
    it('should load all eduContents', () => {
      const action = new EduContentActions.EduContentsLoaded({ eduContents });
      const result = reducer(initialState, action);
      expect(result).toEqual(createState(eduContents, true));
    });

    it('should error', () => {
      const error = 'Something went wrong';
      const action = new EduContentActions.EduContentsLoadError(error);
      const result = reducer(initialState, action);
      expect(result).toEqual(createState([], false, error));
    });
  });

  describe('add actions', () => {
    it('should add one eduContent', () => {
      const eduContent = eduContents[0];
      const action = new EduContentActions.AddEduContent({
        eduContent
      });

      const result = reducer(initialState, action);
      expect(result).toEqual(createState([eduContent], false));
    });

    it('should add multiple eduContents', () => {
      const action = new EduContentActions.AddEduContents({ eduContents });
      const result = reducer(initialState, action);

      expect(result).toEqual(createState(eduContents, false));
    });
  });

  describe('sortEduContent', () => {
    it('should sort by name', () => {
      const eduContents = [
        new EduContentFixture({ id: 1 }, { title: 'c' }),
        new EduContentFixture({ id: 2 }, { title: 'b' }),
        new EduContentFixture({ id: 3 }, { title: 'a' })
      ];

      const sortedIds = eduContents.sort(sortEduContent).map(e => e.id);
      expect(sortedIds).toEqual([3, 2, 1]);
    });

    it('should sort by name, then by year', () => {
      const eduContents = [
        new EduContentFixture(
          { id: 1 },
          { title: 'b', years: [{ name: '3' }] }
        ),
        new EduContentFixture(
          { id: 2 },
          { title: 'a', years: [{ name: '1' }] }
        ),
        new EduContentFixture({ id: 3 }, { title: 'b', years: [{ name: '2' }] })
      ];

      const sortedIds = eduContents.sort(sortEduContent).map(e => e.id);
      expect(sortedIds).toEqual([2, 3, 1]);
    });

    it('should sort by name, then by year, then by id', () => {
      const eduContents = [
        new EduContentFixture(
          { id: 1 },
          { title: 'b', years: [{ name: '1' }] }
        ),
        new EduContentFixture(
          { id: 2 },
          { title: 'a', years: [{ name: '1' }] }
        ),
        new EduContentFixture({ id: 3 }, { title: 'b', years: [{ name: '1' }] })
      ];

      const sortedIds = eduContents.sort(sortEduContent).map(e => e.id);
      expect(sortedIds).toEqual([2, 1, 3]);
    });
  });

  describe('upsert actions', () => {
    it('should upsert one eduContent', () => {
      const originalEduContent = eduContents[0];

      const startState = reducer(
        initialState,
        new EduContentActions.AddEduContent({
          eduContent: originalEduContent
        })
      );

      const updatedEduContent = createEduContent(eduContents[0].id, 'test');

      const action = new EduContentActions.UpsertEduContent({
        eduContent: updatedEduContent
      });

      const result = reducer(startState, action);

      expect(result.entities[updatedEduContent.id]).toEqual(updatedEduContent);
    });

    it('should upsert many eduContents', () => {
      const startState = createState(eduContents);

      const eduContentsToInsert = [
        createEduContent(1),
        createEduContent(2),
        createEduContent(3),
        createEduContent(4)
      ];
      const action = new EduContentActions.UpsertEduContents({
        eduContents: eduContentsToInsert
      });

      const result = reducer(startState, action);

      expect(result).toEqual(createState(eduContentsToInsert));
    });
  });

  describe('update actions', () => {
    it('should update an eduContent', () => {
      const eduContent = eduContents[0];
      const startState = createState([eduContent]);
      const update: Update<EduContentInterface> = {
        id: 1,
        changes: {
          type: typeUpdatedValue
        }
      };
      const action = new EduContentActions.UpdateEduContent({
        eduContent: update
      });
      const result = reducer(startState, action);
      expect(result).toEqual(
        createState([createEduContent(1, typeUpdatedValue)])
      );
    });

    it('should update multiple eduContents', () => {
      const startState = createState(eduContents);
      const updates: Update<EduContentInterface>[] = [
        {
          id: 1,
          changes: {
            type: typeUpdatedValue
          }
        },
        {
          id: 2,
          changes: {
            type: typeUpdatedValue
          }
        }
      ];
      const action = new EduContentActions.UpdateEduContents({
        eduContents: updates
      });
      const result = reducer(startState, action);

      expect(result).toEqual(
        createState([
          createEduContent(1, typeUpdatedValue),
          createEduContent(2, typeUpdatedValue),
          eduContents[2]
        ])
      );
    });
  });

  describe('delete actions', () => {
    it('should delete one eduContent ', () => {
      const eduContent = eduContents[0];
      const startState = createState([eduContent]);
      const action = new EduContentActions.DeleteEduContent({
        id: eduContent.id
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([]));
    });

    it('should delete multiple eduContents', () => {
      const startState = createState(eduContents);
      const action = new EduContentActions.DeleteEduContents({
        ids: [eduContents[0].id, eduContents[1].id]
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([eduContents[2]]));
    });
  });

  describe('clear action', () => {
    it('should clear the eduContents collection', () => {
      const startState = createState(eduContents, true, 'something went wrong');
      const action = new EduContentActions.ClearEduContents();
      const result = reducer(startState, action);
      expect(result).toEqual(createState([], true, 'something went wrong'));
    });
  });
});
