import { Update } from '@ngrx/entity';
import {HistoryActions } from '.';
import { initialState, reducer, State } from './history.reducer';
import { HistoryInterface } from '../../+models';

/** 
 * This file is scaffolded, but needs some special attention:
 * - find and replace '__EXTRA__PROPERTY_NAME' and replace this with a property name of the History entity.
 * - set the initial property value via '[__EXTRA__PROPERTY_NAME]InitialValue'.
 * - set the updated property value via '[__EXTRA__PROPERTY_NAME]UpdatedValue'.
*/
const __EXTRA__PROPERTY_NAMEInitialValue = ;
const __EXTRA__PROPERTY_NAMEUpdatedValue = ;

/**
 * Creates a History.
 * @param {number} id
 * @returns {HistoryInterface}
 */
function createHistory(id: number, __EXTRA__PROPERTY_NAME:any = __EXTRA__PROPERTY_NAMEInitialValue): HistoryInterface | any {
  return {
    id: id,
    __EXTRA__PROPERTY_NAME: __EXTRA__PROPERTY_NAME
  };
}

/**
 * Utility to create the history state.
 *
 * @param {HistoryInterface[]} history
 * @param {boolean} [loaded]
 * @param {*} [error]
 * @returns {State}
 */
function createState(
  history: HistoryInterface[],
  loaded: boolean = false,
  error?: any
): State {
  const state: any = {
    ids: history ? history.map(history => history.id) : [],
    entities: history
      ? history.reduce(
          (entityMap, history) => ({
            ...entityMap,
            [history.id]: history
          }),
          {}
        )
      : {},
    loaded: loaded
  };
  if (error !== undefined) state.error = error;
  return state;
}


describe('History Reducer', () => {
  let history: HistoryInterface[];
  beforeEach(() => {
    history = [
      createHistory(1),
      createHistory(2),
      createHistory(3)
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
    it('should load all history', () => {
      const action = new HistoryActions.HistoryLoaded({ history });
      const result = reducer(initialState, action);
      expect(result).toEqual(createState(history, true));
    });

    it('should error', () => {
      const error = 'Something went wrong';
      const action = new HistoryActions.HistoryLoadError(error);
      const result = reducer(initialState, action);
      expect(result).toEqual(createState([], false, error));
    });
  });

  describe('add actions', () => {
    it('should add one history', () => {
      const history = history[0];
      const action = new HistoryActions.AddHistory({
        history
      });

      const result = reducer(initialState, action);
      expect(result).toEqual(createState([history], false));
    });

    it('should add multiple history', () => {
      const action = new HistoryActions.AddHistory({ history });
      const result = reducer(initialState, action);

      expect(result).toEqual(createState(history, false));
    });
  });
  describe('upsert actions', () => {
    it('should upsert one history', () => {
      const originalHistory = history[0];
      
      const startState = reducer(
        initialState,
        new HistoryActions.AddHistory({
          history: originalHistory
        })
      );

    
      const updatedHistory = createHistory(history[0].id, 'test');
     
      const action = new HistoryActions.UpsertHistory({
        history: updatedHistory
      });

      const result = reducer(startState, action);

      expect(result.entities[updatedHistory.id]).toEqual(updatedHistory);
    });

    it('should upsert many history', () => {
      const startState = createState(history);

      const historyToInsert = [
        createHistory(1),
        createHistory(2),
        createHistory(3),
        createHistory(4)
      ];
      const action = new HistoryActions.UpsertHistory({
        history: historyToInsert
      });

      const result = reducer(startState, action);

      expect(result).toEqual(
        createState(historyToInsert)
      );
    });
  });

  describe('update actions', () => {
    it('should update an history', () => {
      const history = history[0];
      const startState = createState([history]);
      const update: Update<HistoryInterface> = {
        id: 1,
        changes: {
          __EXTRA__PROPERTY_NAME: __EXTRA__PROPERTY_NAMEUpdatedValue
        } 
      };
      const action = new HistoryActions.UpdateHistory({
        history: update
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([createHistory(1, __EXTRA__PROPERTY_NAMEUpdatedValue)]));
    });

    it('should update multiple history', () => {
      const startState = createState(history);
      const updates: Update<HistoryInterface>[] = [
        
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
      const action = new HistoryActions.UpdateHistory({
        history: updates
      });
      const result = reducer(startState, action);

      expect(result).toEqual(
        createState([createHistory(1, __EXTRA__PROPERTY_NAMEUpdatedValue), createHistory(2, __EXTRA__PROPERTY_NAMEUpdatedValue), history[2]])
      );
    });
  });

  describe('delete actions', () => {
    it('should delete one history ', () => {
      const history = history[0];
      const startState = createState([history]);
      const action = new HistoryActions.DeleteHistory({
        id: history.id
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([]));
    });

    it('should delete multiple history', () => {
      const startState = createState(history);
      const action = new HistoryActions.DeleteHistory({
        ids: [history[0].id, history[1].id]
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([history[2]]));
    });
  });

  describe('clear action', () => {
    it('should clear the history collection', () => {
      const startState = createState(history, true, 'something went wrong');
      const action = new HistoryActions.ClearHistorys();
      const result = reducer(startState, action);
      expect(result).toEqual(createState([], true, 'something went wrong'));
    });
  });
});
