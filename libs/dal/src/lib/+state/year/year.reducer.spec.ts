import { Update } from '@ngrx/entity';
import {YearActions } from '.';
import { initialState, reducer, State } from './year.reducer';
import { YearInterface } from '../../+models';

/** 
 * This file is scaffolded, but needs some special attention:
 * - find and replace '__EXTRA__PROPERTY_NAME' and replace this with a property name of the Year entity.
 * - set the initial property value via '[__EXTRA__PROPERTY_NAME]InitialValue'.
 * - set the updated property value via '[__EXTRA__PROPERTY_NAME]UpdatedValue'.
*/
const __EXTRA__PROPERTY_NAMEInitialValue = ;
const __EXTRA__PROPERTY_NAMEUpdatedValue = ;

/**
 * Creates a Year.
 * @param {number} id
 * @returns {YearInterface}
 */
function createYear(id: number, __EXTRA__PROPERTY_NAME:any = __EXTRA__PROPERTY_NAMEInitialValue): YearInterface | any {
  return {
    id: id,
    __EXTRA__PROPERTY_NAME: __EXTRA__PROPERTY_NAME
  };
}

/**
 * Utility to create the year state.
 *
 * @param {YearInterface[]} years
 * @param {boolean} [loaded]
 * @param {*} [error]
 * @returns {State}
 */
function createState(
  years: YearInterface[],
  loaded: boolean = false,
  error?: any
): State {
  const state: any = {
    ids: years ? years.map(year => year.id) : [],
    entities: years
      ? years.reduce(
          (entityMap, year) => ({
            ...entityMap,
            [year.id]: year
          }),
          {}
        )
      : {},
    loaded: loaded
  };
  if (error !== undefined) state.error = error;
  return state;
}


describe('Years Reducer', () => {
  let years: YearInterface[];
  beforeEach(() => {
    years = [
      createYear(1),
      createYear(2),
      createYear(3)
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
    it('should load all years', () => {
      const action = new YearActions.YearsLoaded({ years });
      const result = reducer(initialState, action);
      expect(result).toEqual(createState(years, true));
    });

    it('should error', () => {
      const error = 'Something went wrong';
      const action = new YearActions.YearsLoadError(error);
      const result = reducer(initialState, action);
      expect(result).toEqual(createState([], false, error));
    });
  });

  describe('add actions', () => {
    it('should add one year', () => {
      const year = years[0];
      const action = new YearActions.AddYear({
        year
      });

      const result = reducer(initialState, action);
      expect(result).toEqual(createState([year], false));
    });

    it('should add multiple years', () => {
      const action = new YearActions.AddYears({ years });
      const result = reducer(initialState, action);

      expect(result).toEqual(createState(years, false));
    });
  });
  describe('upsert actions', () => {
    it('should upsert one year', () => {
      const originalYear = years[0];
      
      const startState = reducer(
        initialState,
        new YearActions.AddYear({
          year: originalYear
        })
      );

    
      const updatedYear = createYear(years[0].id, 'test');
     
      const action = new YearActions.UpsertYear({
        year: updatedYear
      });

      const result = reducer(startState, action);

      expect(result.entities[updatedYear.id]).toEqual(updatedYear);
    });

    it('should upsert many years', () => {
      const startState = createState(years);

      const yearsToInsert = [
        createYear(1),
        createYear(2),
        createYear(3),
        createYear(4)
      ];
      const action = new YearActions.UpsertYears({
        years: yearsToInsert
      });

      const result = reducer(startState, action);

      expect(result).toEqual(
        createState(yearsToInsert)
      );
    });
  });

  describe('update actions', () => {
    it('should update an year', () => {
      const year = years[0];
      const startState = createState([year]);
      const update: Update<YearInterface> = {
        id: 1,
        changes: {
          __EXTRA__PROPERTY_NAME: __EXTRA__PROPERTY_NAMEUpdatedValue
        } 
      };
      const action = new YearActions.UpdateYear({
        year: update
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([createYear(1, __EXTRA__PROPERTY_NAMEUpdatedValue)]));
    });

    it('should update multiple years', () => {
      const startState = createState(years);
      const updates: Update<YearInterface>[] = [
        
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
      const action = new YearActions.UpdateYears({
        years: updates
      });
      const result = reducer(startState, action);

      expect(result).toEqual(
        createState([createYear(1, __EXTRA__PROPERTY_NAMEUpdatedValue), createYear(2, __EXTRA__PROPERTY_NAMEUpdatedValue), years[2]])
      );
    });
  });

  describe('delete actions', () => {
    it('should delete one year ', () => {
      const year = years[0];
      const startState = createState([year]);
      const action = new YearActions.DeleteYear({
        id: year.id
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([]));
    });

    it('should delete multiple years', () => {
      const startState = createState(years);
      const action = new YearActions.DeleteYears({
        ids: [years[0].id, years[1].id]
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([years[2]]));
    });
  });

  describe('clear action', () => {
    it('should clear the years collection', () => {
      const startState = createState(years, true, 'something went wrong');
      const action = new YearActions.ClearYears();
      const result = reducer(startState, action);
      expect(result).toEqual(createState([], true, 'something went wrong'));
    });
  });
});
