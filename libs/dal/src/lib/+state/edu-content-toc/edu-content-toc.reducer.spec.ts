import { Update } from '@ngrx/entity';
import {EduContentTocActions } from '.';
import { initialState, reducer, State } from './edu-content-toc.reducer';
import { EduContentTocInterface } from '../../+models';

/** 
 * This file is scaffolded, but needs some special attention:
 * - find and replace '__EXTRA__PROPERTY_NAME' and replace this with a property name of the EduContentToc entity.
 * - set the initial property value via '[__EXTRA__PROPERTY_NAME]InitialValue'.
 * - set the updated property value via '[__EXTRA__PROPERTY_NAME]UpdatedValue'.
*/
const __EXTRA__PROPERTY_NAMEInitialValue = ;
const __EXTRA__PROPERTY_NAMEUpdatedValue = ;

/**
 * Creates a EduContentToc.
 * @param {number} id
 * @returns {EduContentTocInterface}
 */
function createEduContentToc(id: number, __EXTRA__PROPERTY_NAME:any = __EXTRA__PROPERTY_NAMEInitialValue): EduContentTocInterface | any {
  return {
    id: id,
    __EXTRA__PROPERTY_NAME: __EXTRA__PROPERTY_NAME
  };
}

/**
 * Utility to create the edu-content-toc state.
 *
 * @param {EduContentTocInterface[]} eduContentTocs
 * @param {boolean} [loaded]
 * @param {*} [error]
 * @returns {State}
 */
function createState(
  eduContentTocs: EduContentTocInterface[],
  loaded: boolean = false,
  error?: any
): State {
  const state: any = {
    ids: eduContentTocs ? eduContentTocs.map(eduContentToc => eduContentToc.id) : [],
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
  let eduContentTocs: EduContentTocInterface[];
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
    it('should load all eduContentTocs', () => {
      const action = new EduContentTocActions.EduContentTocsLoaded({ eduContentTocs });
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
      const action = new EduContentTocActions.AddEduContentTocs({ eduContentTocs });
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

    
      const updatedEduContentToc = createEduContentToc(eduContentTocs[0].id, 'test');
     
      const action = new EduContentTocActions.UpsertEduContentToc({
        eduContentToc: updatedEduContentToc
      });

      const result = reducer(startState, action);

      expect(result.entities[updatedEduContentToc.id]).toEqual(updatedEduContentToc);
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

      expect(result).toEqual(
        createState(eduContentTocsToInsert)
      );
    });
  });

  describe('update actions', () => {
    it('should update an eduContentToc', () => {
      const eduContentToc = eduContentTocs[0];
      const startState = createState([eduContentToc]);
      const update: Update<EduContentTocInterface> = {
        id: 1,
        changes: {
          __EXTRA__PROPERTY_NAME: __EXTRA__PROPERTY_NAMEUpdatedValue
        } 
      };
      const action = new EduContentTocActions.UpdateEduContentToc({
        eduContentToc: update
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([createEduContentToc(1, __EXTRA__PROPERTY_NAMEUpdatedValue)]));
    });

    it('should update multiple eduContentTocs', () => {
      const startState = createState(eduContentTocs);
      const updates: Update<EduContentTocInterface>[] = [
        
        {
          id: 1,
          changes: {
            __EXTRA__PROPERTY_NAME: __EXTRA__PROPERTY_NAMEUpdatedValue
          } 
        },
        {
          id: 2,
          changes: {
            __EXTRA__PROPERTY_NAME: __EXTRA__PROPERTY_NAMEUpdatedValue
          }  
        }
      ];
      const action = new EduContentTocActions.UpdateEduContentTocs({
        eduContentTocs: updates
      });
      const result = reducer(startState, action);

      expect(result).toEqual(
        createState([createEduContentToc(1, __EXTRA__PROPERTY_NAMEUpdatedValue), createEduContentToc(2, __EXTRA__PROPERTY_NAMEUpdatedValue), eduContentTocs[2]])
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
      const startState = createState(eduContentTocs, true, 'something went wrong');
      const action = new EduContentTocActions.ClearEduContentTocs();
      const result = reducer(startState, action);
      expect(result).toEqual(createState([], true, 'something went wrong'));
    });
  });
});
