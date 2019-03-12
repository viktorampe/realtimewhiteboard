import { Update } from '@ngrx/entity';
import {SchoolTypeActions } from '.';
import { initialState, reducer, State } from './school-type.reducer';
import { SchoolTypeInterface } from '../../+models';

/** 
 * This file is scaffolded, but needs some special attention:
 * - find and replace '__EXTRA__PROPERTY_NAME' and replace this with a property name of the SchoolType entity.
 * - set the initial property value via '[__EXTRA__PROPERTY_NAME]InitialValue'.
 * - set the updated property value via '[__EXTRA__PROPERTY_NAME]UpdatedValue'.
*/
const __EXTRA__PROPERTY_NAMEInitialValue = ;
const __EXTRA__PROPERTY_NAMEUpdatedValue = ;

/**
 * Creates a SchoolType.
 * @param {number} id
 * @returns {SchoolTypeInterface}
 */
function createSchoolType(id: number, __EXTRA__PROPERTY_NAME:any = __EXTRA__PROPERTY_NAMEInitialValue): SchoolTypeInterface | any {
  return {
    id: id,
    __EXTRA__PROPERTY_NAME: __EXTRA__PROPERTY_NAME
  };
}

/**
 * Utility to create the school-type state.
 *
 * @param {SchoolTypeInterface[]} schoolTypes
 * @param {boolean} [loaded]
 * @param {*} [error]
 * @returns {State}
 */
function createState(
  schoolTypes: SchoolTypeInterface[],
  loaded: boolean = false,
  error?: any
): State {
  const state: any = {
    ids: schoolTypes ? schoolTypes.map(schoolType => schoolType.id) : [],
    entities: schoolTypes
      ? schoolTypes.reduce(
          (entityMap, schoolType) => ({
            ...entityMap,
            [schoolType.id]: schoolType
          }),
          {}
        )
      : {},
    loaded: loaded
  };
  if (error !== undefined) state.error = error;
  return state;
}


describe('SchoolTypes Reducer', () => {
  let schoolTypes: SchoolTypeInterface[];
  beforeEach(() => {
    schoolTypes = [
      createSchoolType(1),
      createSchoolType(2),
      createSchoolType(3)
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
    it('should load all schoolTypes', () => {
      const action = new SchoolTypeActions.SchoolTypesLoaded({ schoolTypes });
      const result = reducer(initialState, action);
      expect(result).toEqual(createState(schoolTypes, true));
    });

    it('should error', () => {
      const error = 'Something went wrong';
      const action = new SchoolTypeActions.SchoolTypesLoadError(error);
      const result = reducer(initialState, action);
      expect(result).toEqual(createState([], false, error));
    });
  });

  describe('add actions', () => {
    it('should add one schoolType', () => {
      const schoolType = schoolTypes[0];
      const action = new SchoolTypeActions.AddSchoolType({
        schoolType
      });

      const result = reducer(initialState, action);
      expect(result).toEqual(createState([schoolType], false));
    });

    it('should add multiple schoolTypes', () => {
      const action = new SchoolTypeActions.AddSchoolTypes({ schoolTypes });
      const result = reducer(initialState, action);

      expect(result).toEqual(createState(schoolTypes, false));
    });
  });
  describe('upsert actions', () => {
    it('should upsert one schoolType', () => {
      const originalSchoolType = schoolTypes[0];
      
      const startState = reducer(
        initialState,
        new SchoolTypeActions.AddSchoolType({
          schoolType: originalSchoolType
        })
      );

    
      const updatedSchoolType = createSchoolType(schoolTypes[0].id, 'test');
     
      const action = new SchoolTypeActions.UpsertSchoolType({
        schoolType: updatedSchoolType
      });

      const result = reducer(startState, action);

      expect(result.entities[updatedSchoolType.id]).toEqual(updatedSchoolType);
    });

    it('should upsert many schoolTypes', () => {
      const startState = createState(schoolTypes);

      const schoolTypesToInsert = [
        createSchoolType(1),
        createSchoolType(2),
        createSchoolType(3),
        createSchoolType(4)
      ];
      const action = new SchoolTypeActions.UpsertSchoolTypes({
        schoolTypes: schoolTypesToInsert
      });

      const result = reducer(startState, action);

      expect(result).toEqual(
        createState(schoolTypesToInsert)
      );
    });
  });

  describe('update actions', () => {
    it('should update an schoolType', () => {
      const schoolType = schoolTypes[0];
      const startState = createState([schoolType]);
      const update: Update<SchoolTypeInterface> = {
        id: 1,
        changes: {
          __EXTRA__PROPERTY_NAME: __EXTRA__PROPERTY_NAMEUpdatedValue
        } 
      };
      const action = new SchoolTypeActions.UpdateSchoolType({
        schoolType: update
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([createSchoolType(1, __EXTRA__PROPERTY_NAMEUpdatedValue)]));
    });

    it('should update multiple schoolTypes', () => {
      const startState = createState(schoolTypes);
      const updates: Update<SchoolTypeInterface>[] = [
        
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
      const action = new SchoolTypeActions.UpdateSchoolTypes({
        schoolTypes: updates
      });
      const result = reducer(startState, action);

      expect(result).toEqual(
        createState([createSchoolType(1, __EXTRA__PROPERTY_NAMEUpdatedValue), createSchoolType(2, __EXTRA__PROPERTY_NAMEUpdatedValue), schoolTypes[2]])
      );
    });
  });

  describe('delete actions', () => {
    it('should delete one schoolType ', () => {
      const schoolType = schoolTypes[0];
      const startState = createState([schoolType]);
      const action = new SchoolTypeActions.DeleteSchoolType({
        id: schoolType.id
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([]));
    });

    it('should delete multiple schoolTypes', () => {
      const startState = createState(schoolTypes);
      const action = new SchoolTypeActions.DeleteSchoolTypes({
        ids: [schoolTypes[0].id, schoolTypes[1].id]
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([schoolTypes[2]]));
    });
  });

  describe('clear action', () => {
    it('should clear the schoolTypes collection', () => {
      const startState = createState(schoolTypes, true, 'something went wrong');
      const action = new SchoolTypeActions.ClearSchoolTypes();
      const result = reducer(startState, action);
      expect(result).toEqual(createState([], true, 'something went wrong'));
    });
  });
});
