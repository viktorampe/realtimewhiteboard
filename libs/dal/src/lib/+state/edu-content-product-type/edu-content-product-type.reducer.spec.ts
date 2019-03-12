import { Update } from '@ngrx/entity';
import {EduContentProductTypeActions } from '.';
import { initialState, reducer, State } from './edu-content-product-type.reducer';
import { EduContentProductTypeInterface } from '../../+models';

/** 
 * This file is scaffolded, but needs some special attention:
 * - find and replace '__EXTRA__PROPERTY_NAME' and replace this with a property name of the EduContentProductType entity.
 * - set the initial property value via '[__EXTRA__PROPERTY_NAME]InitialValue'.
 * - set the updated property value via '[__EXTRA__PROPERTY_NAME]UpdatedValue'.
*/
const __EXTRA__PROPERTY_NAMEInitialValue = ;
const __EXTRA__PROPERTY_NAMEUpdatedValue = ;

/**
 * Creates a EduContentProductType.
 * @param {number} id
 * @returns {EduContentProductTypeInterface}
 */
function createEduContentProductType(id: number, __EXTRA__PROPERTY_NAME:any = __EXTRA__PROPERTY_NAMEInitialValue): EduContentProductTypeInterface | any {
  return {
    id: id,
    __EXTRA__PROPERTY_NAME: __EXTRA__PROPERTY_NAME
  };
}

/**
 * Utility to create the edu-content-product-type state.
 *
 * @param {EduContentProductTypeInterface[]} eduContentProductTypes
 * @param {boolean} [loaded]
 * @param {*} [error]
 * @returns {State}
 */
function createState(
  eduContentProductTypes: EduContentProductTypeInterface[],
  loaded: boolean = false,
  error?: any
): State {
  const state: any = {
    ids: eduContentProductTypes ? eduContentProductTypes.map(eduContentProductType => eduContentProductType.id) : [],
    entities: eduContentProductTypes
      ? eduContentProductTypes.reduce(
          (entityMap, eduContentProductType) => ({
            ...entityMap,
            [eduContentProductType.id]: eduContentProductType
          }),
          {}
        )
      : {},
    loaded: loaded
  };
  if (error !== undefined) state.error = error;
  return state;
}


describe('EduContentProductTypes Reducer', () => {
  let eduContentProductTypes: EduContentProductTypeInterface[];
  beforeEach(() => {
    eduContentProductTypes = [
      createEduContentProductType(1),
      createEduContentProductType(2),
      createEduContentProductType(3)
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
    it('should load all eduContentProductTypes', () => {
      const action = new EduContentProductTypeActions.EduContentProductTypesLoaded({ eduContentProductTypes });
      const result = reducer(initialState, action);
      expect(result).toEqual(createState(eduContentProductTypes, true));
    });

    it('should error', () => {
      const error = 'Something went wrong';
      const action = new EduContentProductTypeActions.EduContentProductTypesLoadError(error);
      const result = reducer(initialState, action);
      expect(result).toEqual(createState([], false, error));
    });
  });

  describe('add actions', () => {
    it('should add one eduContentProductType', () => {
      const eduContentProductType = eduContentProductTypes[0];
      const action = new EduContentProductTypeActions.AddEduContentProductType({
        eduContentProductType
      });

      const result = reducer(initialState, action);
      expect(result).toEqual(createState([eduContentProductType], false));
    });

    it('should add multiple eduContentProductTypes', () => {
      const action = new EduContentProductTypeActions.AddEduContentProductTypes({ eduContentProductTypes });
      const result = reducer(initialState, action);

      expect(result).toEqual(createState(eduContentProductTypes, false));
    });
  });
  describe('upsert actions', () => {
    it('should upsert one eduContentProductType', () => {
      const originalEduContentProductType = eduContentProductTypes[0];
      
      const startState = reducer(
        initialState,
        new EduContentProductTypeActions.AddEduContentProductType({
          eduContentProductType: originalEduContentProductType
        })
      );

    
      const updatedEduContentProductType = createEduContentProductType(eduContentProductTypes[0].id, 'test');
     
      const action = new EduContentProductTypeActions.UpsertEduContentProductType({
        eduContentProductType: updatedEduContentProductType
      });

      const result = reducer(startState, action);

      expect(result.entities[updatedEduContentProductType.id]).toEqual(updatedEduContentProductType);
    });

    it('should upsert many eduContentProductTypes', () => {
      const startState = createState(eduContentProductTypes);

      const eduContentProductTypesToInsert = [
        createEduContentProductType(1),
        createEduContentProductType(2),
        createEduContentProductType(3),
        createEduContentProductType(4)
      ];
      const action = new EduContentProductTypeActions.UpsertEduContentProductTypes({
        eduContentProductTypes: eduContentProductTypesToInsert
      });

      const result = reducer(startState, action);

      expect(result).toEqual(
        createState(eduContentProductTypesToInsert)
      );
    });
  });

  describe('update actions', () => {
    it('should update an eduContentProductType', () => {
      const eduContentProductType = eduContentProductTypes[0];
      const startState = createState([eduContentProductType]);
      const update: Update<EduContentProductTypeInterface> = {
        id: 1,
        changes: {
          __EXTRA__PROPERTY_NAME: __EXTRA__PROPERTY_NAMEUpdatedValue
        } 
      };
      const action = new EduContentProductTypeActions.UpdateEduContentProductType({
        eduContentProductType: update
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([createEduContentProductType(1, __EXTRA__PROPERTY_NAMEUpdatedValue)]));
    });

    it('should update multiple eduContentProductTypes', () => {
      const startState = createState(eduContentProductTypes);
      const updates: Update<EduContentProductTypeInterface>[] = [
        
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
      const action = new EduContentProductTypeActions.UpdateEduContentProductTypes({
        eduContentProductTypes: updates
      });
      const result = reducer(startState, action);

      expect(result).toEqual(
        createState([createEduContentProductType(1, __EXTRA__PROPERTY_NAMEUpdatedValue), createEduContentProductType(2, __EXTRA__PROPERTY_NAMEUpdatedValue), eduContentProductTypes[2]])
      );
    });
  });

  describe('delete actions', () => {
    it('should delete one eduContentProductType ', () => {
      const eduContentProductType = eduContentProductTypes[0];
      const startState = createState([eduContentProductType]);
      const action = new EduContentProductTypeActions.DeleteEduContentProductType({
        id: eduContentProductType.id
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([]));
    });

    it('should delete multiple eduContentProductTypes', () => {
      const startState = createState(eduContentProductTypes);
      const action = new EduContentProductTypeActions.DeleteEduContentProductTypes({
        ids: [eduContentProductTypes[0].id, eduContentProductTypes[1].id]
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([eduContentProductTypes[2]]));
    });
  });

  describe('clear action', () => {
    it('should clear the eduContentProductTypes collection', () => {
      const startState = createState(eduContentProductTypes, true, 'something went wrong');
      const action = new EduContentProductTypeActions.ClearEduContentProductTypes();
      const result = reducer(startState, action);
      expect(result).toEqual(createState([], true, 'something went wrong'));
    });
  });
});
