import { Update } from '@ngrx/entity';
import {MethodActions } from '.';
import { initialState, reducer, State } from './method.reducer';
import { MethodInterface } from '../../+models';

/** 
 * This file is scaffolded, but needs some special attention:
 * - find and replace '__EXTRA__PROPERTY_NAME' and replace this with a property name of the Method entity.
 * - set the initial property value via '[__EXTRA__PROPERTY_NAME]InitialValue'.
 * - set the updated property value via '[__EXTRA__PROPERTY_NAME]UpdatedValue'.
*/
const __EXTRA__PROPERTY_NAMEInitialValue = ;
const __EXTRA__PROPERTY_NAMEUpdatedValue = ;

/**
 * Creates a Method.
 * @param {number} id
 * @returns {MethodInterface}
 */
function createMethod(id: number, __EXTRA__PROPERTY_NAME:any = __EXTRA__PROPERTY_NAMEInitialValue): MethodInterface | any {
  return {
    id: id,
    __EXTRA__PROPERTY_NAME: __EXTRA__PROPERTY_NAME
  };
}

/**
 * Utility to create the method state.
 *
 * @param {MethodInterface[]} methods
 * @param {boolean} [loaded]
 * @param {*} [error]
 * @returns {State}
 */
function createState(
  methods: MethodInterface[],
  loaded: boolean = false,
  error?: any
): State {
  const state: any = {
    ids: methods ? methods.map(method => method.id) : [],
    entities: methods
      ? methods.reduce(
          (entityMap, method) => ({
            ...entityMap,
            [method.id]: method
          }),
          {}
        )
      : {},
    loaded: loaded
  };
  if (error !== undefined) state.error = error;
  return state;
}


describe('Methods Reducer', () => {
  let methods: MethodInterface[];
  beforeEach(() => {
    methods = [
      createMethod(1),
      createMethod(2),
      createMethod(3)
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
    it('should load all methods', () => {
      const action = new MethodActions.MethodsLoaded({ methods });
      const result = reducer(initialState, action);
      expect(result).toEqual(createState(methods, true));
    });

    it('should error', () => {
      const error = 'Something went wrong';
      const action = new MethodActions.MethodsLoadError(error);
      const result = reducer(initialState, action);
      expect(result).toEqual(createState([], false, error));
    });
  });

  describe('add actions', () => {
    it('should add one method', () => {
      const method = methods[0];
      const action = new MethodActions.AddMethod({
        method
      });

      const result = reducer(initialState, action);
      expect(result).toEqual(createState([method], false));
    });

    it('should add multiple methods', () => {
      const action = new MethodActions.AddMethods({ methods });
      const result = reducer(initialState, action);

      expect(result).toEqual(createState(methods, false));
    });
  });
  describe('upsert actions', () => {
    it('should upsert one method', () => {
      const originalMethod = methods[0];
      
      const startState = reducer(
        initialState,
        new MethodActions.AddMethod({
          method: originalMethod
        })
      );

    
      const updatedMethod = createMethod(methods[0].id, 'test');
     
      const action = new MethodActions.UpsertMethod({
        method: updatedMethod
      });

      const result = reducer(startState, action);

      expect(result.entities[updatedMethod.id]).toEqual(updatedMethod);
    });

    it('should upsert many methods', () => {
      const startState = createState(methods);

      const methodsToInsert = [
        createMethod(1),
        createMethod(2),
        createMethod(3),
        createMethod(4)
      ];
      const action = new MethodActions.UpsertMethods({
        methods: methodsToInsert
      });

      const result = reducer(startState, action);

      expect(result).toEqual(
        createState(methodsToInsert)
      );
    });
  });

  describe('update actions', () => {
    it('should update an method', () => {
      const method = methods[0];
      const startState = createState([method]);
      const update: Update<MethodInterface> = {
        id: 1,
        changes: {
          __EXTRA__PROPERTY_NAME: __EXTRA__PROPERTY_NAMEUpdatedValue
        } 
      };
      const action = new MethodActions.UpdateMethod({
        method: update
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([createMethod(1, __EXTRA__PROPERTY_NAMEUpdatedValue)]));
    });

    it('should update multiple methods', () => {
      const startState = createState(methods);
      const updates: Update<MethodInterface>[] = [
        
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
      const action = new MethodActions.UpdateMethods({
        methods: updates
      });
      const result = reducer(startState, action);

      expect(result).toEqual(
        createState([createMethod(1, __EXTRA__PROPERTY_NAMEUpdatedValue), createMethod(2, __EXTRA__PROPERTY_NAMEUpdatedValue), methods[2]])
      );
    });
  });

  describe('delete actions', () => {
    it('should delete one method ', () => {
      const method = methods[0];
      const startState = createState([method]);
      const action = new MethodActions.DeleteMethod({
        id: method.id
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([]));
    });

    it('should delete multiple methods', () => {
      const startState = createState(methods);
      const action = new MethodActions.DeleteMethods({
        ids: [methods[0].id, methods[1].id]
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([methods[2]]));
    });
  });

  describe('clear action', () => {
    it('should clear the methods collection', () => {
      const startState = createState(methods, true, 'something went wrong');
      const action = new MethodActions.ClearMethods();
      const result = reducer(startState, action);
      expect(result).toEqual(createState([], true, 'something went wrong'));
    });
  });
});
