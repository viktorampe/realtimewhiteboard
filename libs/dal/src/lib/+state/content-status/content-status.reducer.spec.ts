import { Update } from '@ngrx/entity';
import {ContentStatusActions } from '.';
import { initialState, reducer, State } from './content-status.reducer';
import { ContentStatusInterface } from '../../+models';

/** 
 * This file is scaffolded, but needs some special attention:
 * - find and replace '__EXTRA__PROPERTY_NAME' and replace this with a property name of the ContentStatus entity.
 * - set the initial property value via '[__EXTRA__PROPERTY_NAME]InitialValue'.
 * - set the updated property value via '[__EXTRA__PROPERTY_NAME]UpdatedValue'.
*/
const __EXTRA__PROPERTY_NAMEInitialValue = ;
const __EXTRA__PROPERTY_NAMEUpdatedValue = ;

/**
 * Creates a ContentStatus.
 * @param {number} id
 * @returns {ContentStatusInterface}
 */
function createContentStatus(id: number, __EXTRA__PROPERTY_NAME:any = __EXTRA__PROPERTY_NAMEInitialValue): ContentStatusInterface | any {
  return {
    id: id,
    __EXTRA__PROPERTY_NAME: __EXTRA__PROPERTY_NAME
  };
}

/**
 * Utility to create the content-status state.
 *
 * @param {ContentStatusInterface[]} contentStatuses
 * @param {boolean} [loaded]
 * @param {*} [error]
 * @returns {State}
 */
function createState(
  contentStatuses: ContentStatusInterface[],
  loaded: boolean = false,
  error?: any
): State {
  const state: any = {
    ids: contentStatuses ? contentStatuses.map(contentStatus => contentStatus.id) : [],
    entities: contentStatuses
      ? contentStatuses.reduce(
          (entityMap, contentStatus) => ({
            ...entityMap,
            [contentStatus.id]: contentStatus
          }),
          {}
        )
      : {},
    loaded: loaded
  };
  if (error !== undefined) state.error = error;
  return state;
}


describe('ContentStatuses Reducer', () => {
  let contentStatuses: ContentStatusInterface[];
  beforeEach(() => {
    contentStatuses = [
      createContentStatus(1),
      createContentStatus(2),
      createContentStatus(3)
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
    it('should load all contentStatuses', () => {
      const action = new ContentStatusActions.ContentStatusesLoaded({ contentStatuses });
      const result = reducer(initialState, action);
      expect(result).toEqual(createState(contentStatuses, true));
    });

    it('should error', () => {
      const error = 'Something went wrong';
      const action = new ContentStatusActions.ContentStatusesLoadError(error);
      const result = reducer(initialState, action);
      expect(result).toEqual(createState([], false, error));
    });
  });

  describe('add actions', () => {
    it('should add one contentStatus', () => {
      const contentStatus = contentStatuses[0];
      const action = new ContentStatusActions.AddContentStatus({
        contentStatus
      });

      const result = reducer(initialState, action);
      expect(result).toEqual(createState([contentStatus], false));
    });

    it('should add multiple contentStatuses', () => {
      const action = new ContentStatusActions.AddContentStatuses({ contentStatuses });
      const result = reducer(initialState, action);

      expect(result).toEqual(createState(contentStatuses, false));
    });
  });
  describe('upsert actions', () => {
    it('should upsert one contentStatus', () => {
      const originalContentStatus = contentStatuses[0];
      
      const startState = reducer(
        initialState,
        new ContentStatusActions.AddContentStatus({
          contentStatus: originalContentStatus
        })
      );

    
      const updatedContentStatus = createContentStatus(contentStatuses[0].id, 'test');
     
      const action = new ContentStatusActions.UpsertContentStatus({
        contentStatus: updatedContentStatus
      });

      const result = reducer(startState, action);

      expect(result.entities[updatedContentStatus.id]).toEqual(updatedContentStatus);
    });

    it('should upsert many contentStatuses', () => {
      const startState = createState(contentStatuses);

      const contentStatusesToInsert = [
        createContentStatus(1),
        createContentStatus(2),
        createContentStatus(3),
        createContentStatus(4)
      ];
      const action = new ContentStatusActions.UpsertContentStatuses({
        contentStatuses: contentStatusesToInsert
      });

      const result = reducer(startState, action);

      expect(result).toEqual(
        createState(contentStatusesToInsert)
      );
    });
  });

  describe('update actions', () => {
    it('should update an contentStatus', () => {
      const contentStatus = contentStatuses[0];
      const startState = createState([contentStatus]);
      const update: Update<ContentStatusInterface> = {
        id: 1,
        changes: {
          __EXTRA__PROPERTY_NAME: __EXTRA__PROPERTY_NAMEUpdatedValue
        } 
      };
      const action = new ContentStatusActions.UpdateContentStatus({
        contentStatus: update
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([createContentStatus(1, __EXTRA__PROPERTY_NAMEUpdatedValue)]));
    });

    it('should update multiple contentStatuses', () => {
      const startState = createState(contentStatuses);
      const updates: Update<ContentStatusInterface>[] = [
        
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
      const action = new ContentStatusActions.UpdateContentStatuses({
        contentStatuses: updates
      });
      const result = reducer(startState, action);

      expect(result).toEqual(
        createState([createContentStatus(1, __EXTRA__PROPERTY_NAMEUpdatedValue), createContentStatus(2, __EXTRA__PROPERTY_NAMEUpdatedValue), contentStatuses[2]])
      );
    });
  });

  describe('delete actions', () => {
    it('should delete one contentStatus ', () => {
      const contentStatus = contentStatuses[0];
      const startState = createState([contentStatus]);
      const action = new ContentStatusActions.DeleteContentStatus({
        id: contentStatus.id
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([]));
    });

    it('should delete multiple contentStatuses', () => {
      const startState = createState(contentStatuses);
      const action = new ContentStatusActions.DeleteContentStatuses({
        ids: [contentStatuses[0].id, contentStatuses[1].id]
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([contentStatuses[2]]));
    });
  });

  describe('clear action', () => {
    it('should clear the contentStatuses collection', () => {
      const startState = createState(contentStatuses, true, 'something went wrong');
      const action = new ContentStatusActions.ClearContentStatuss();
      const result = reducer(startState, action);
      expect(result).toEqual(createState([], true, 'something went wrong'));
    });
  });
});
