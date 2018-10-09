import { Update } from '@ngrx/entity';
import { EduContentActions } from '.';
import { EduContentInterface } from '../../+models';
import { initialState, reducer, State } from './edu-contents.reducer';

function createEduContent(id: number, type: string): EduContentInterface {
  return {
    id: id,
    type: type
  };
}
/**
 * Utility to create the eduContent state.
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
      createEduContent(1, 'boeke'),
      createEduContent(2, 'boeke'),
      createEduContent(3, 'boeke')
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
    it('should add one edu-content', () => {
      const eduContent = eduContents[0];
      const action = new EduContentActions.AddEduContent({
        eduContent
      });

      const result = reducer(initialState, action);
      expect(result).toEqual(createState([eduContent], false));
    });

    it('should add mulitple edu-contents', () => {
      const action = new EduContentActions.AddEduContents({ eduContents });
      const result = reducer(initialState, action);

      expect(result).toEqual(createState(eduContents, false));
    });
  });
  describe('upsert actions', () => {
    it('should upsert one edu-content', () => {
      const originalEduContent = eduContents[0];
      // add the eduContent to the state
      reducer(
        initialState,
        new EduContentActions.AddEduContent({
          eduContent: originalEduContent
        })
      );

      // update the original eduContent (same id)
      const updatedEduContent = createEduContent(1, 'updated');
      // and add to the state
      const action = new EduContentActions.UpsertEduContent({
        eduContent: updatedEduContent
      });

      const result = reducer(initialState, action);

      expect(result.entities[updatedEduContent.id]).toBe(updatedEduContent);
    });

    it('should upsert many edu-contents', () => {
      const startState = createState(eduContents);

      // update the original edu-contents and insert a new one
      const eduContentsToInsert = [
        createEduContent(1, 'test'),
        createEduContent(2, 'test2'),
        createEduContent(3, 'test3'),
        createEduContent(4, 'new')
      ];
      const action = new EduContentActions.UpsertEduContents({
        eduContents: eduContentsToInsert
      });

      const result = reducer(startState, action);

      expect(result).toEqual(createState(eduContentsToInsert));
    });
  });

  describe('update actions', () => {
    it('should update an edu-content', () => {
      const eduContent = eduContents[0];
      const startState = createState([eduContent]);
      const update: Update<EduContentInterface> = {
        id: 1,
        changes: {
          type: 'ppt'
        }
      };
      const action = new EduContentActions.UpdateEduContent({
        eduContent: update
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([createEduContent(1, 'ppt')]));
    });

    it('should update multiple edu-contents', () => {
      const startState = createState(eduContents);
      const updates: Update<EduContentInterface>[] = [
        {
          id: 1,
          changes: {
            type: 'ppt'
          }
        },
        {
          id: 2,
          changes: {
            type: 'audio'
          }
        }
      ];
      const action = new EduContentActions.UpdateEduContents({
        eduContents: updates
      });
      const result = reducer(startState, action);

      expect(result).toEqual(
        createState([
          createEduContent(1, 'ppt'),
          createEduContent(2, 'audio'),
          eduContents[2]
        ])
      );
    });
  });

  describe('delete actions', () => {
    it('should delete one edu-content ', () => {
      const eduContent = eduContents[0];
      const startState = createState([eduContent]);
      const action = new EduContentActions.DeleteEduContent({
        id: eduContent.id
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([]));
    });

    it('should delete multiple edu-contents', () => {
      const startState = createState(eduContents);
      const action = new EduContentActions.DeleteEduContents({
        ids: [eduContents[0].id, eduContents[1].id]
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([eduContents[2]]));
    });
  });

  describe('clear action', () => {
    it('should clear the edu-contents collection', () => {
      const startState = createState(eduContents, true, 'something went wrong');
      const action = new EduContentActions.ClearEduContents();
      const result = reducer(startState, action);
      expect(result).toEqual(createState([], true, 'something went wrong'));
    });
  });
});
