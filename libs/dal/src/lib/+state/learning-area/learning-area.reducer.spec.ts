import { Update } from '@ngrx/entity';
import {LearningAreaActions } from '.';
import { initialState, reducer, State } from './learning-area.reducer';
import { LearningAreaInterface } from '../../+models';

/** 
 * This file is scaffolded, but needs some special attention:
 * - find and replace '__EXTRA__PROPERTY_NAME' and replace this with a property name of the LearningArea entity.
 * - set the initial property value via '[__EXTRA__PROPERTY_NAME]InitialValue'.
 * - set the updated property value via '[__EXTRA__PROPERTY_NAME]UpdatedValue'.
*/
const __EXTRA__PROPERTY_NAMEInitialValue = '';
const __EXTRA__PROPERTY_NAMEUpdatedValue = '';

/**
 * Creates a LearningArea.
 * @param {number} id
 * @returns {LearningAreaInterface}
 */
function createLearningArea(id: number, __EXTRA__PROPERTY_NAME:any = __EXTRA__PROPERTY_NAMEInitialValue): LearningAreaInterface | any {
  return {
    id: id,
    __EXTRA__PROPERTY_NAME: __EXTRA__PROPERTY_NAME
  };
}

/**
 * Utility to create the learning-area state.
 *
 * @param {LearningAreaInterface[]} learningAreas
 * @param {boolean} [loaded]
 * @param {*} [error]
 * @returns {State}
 */
function createState(
  learningAreas: LearningAreaInterface[],
  loaded: boolean = false,
  error?: any
): State {
  const state: any = {
    ids: learningAreas ? learningAreas.map(learningArea => learningArea.id) : [],
    entities: learningAreas
      ? learningAreas.reduce(
          (entityMap, learningArea) => ({
            ...entityMap,
            [learningArea.id]: learningArea
          }),
          {}
        )
      : {},
    loaded: loaded
  };
  if (error !== undefined) state.error = error;
  return state;
}


describe('LearningAreas Reducer', () => {
  let learningAreas: LearningAreaInterface[];
  beforeEach(() => {
    learningAreas = [
      createLearningArea(1),
      createLearningArea(2),
      createLearningArea(3)
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
    it('should load all learningAreas', () => {
      const action = new LearningAreaActions.LearningAreasLoaded({ learningAreas });
      const result = reducer(initialState, action);
      expect(result).toEqual(createState(learningAreas, true));
    });

    it('should error', () => {
      const error = 'Something went wrong';
      const action = new LearningAreaActions.LearningAreasLoadError(error);
      const result = reducer(initialState, action);
      expect(result).toEqual(createState([], false, error));
    });
  });

  describe('add actions', () => {
    it('should add one learningArea', () => {
      const learningArea = learningAreas[0];
      const action = new LearningAreaActions.AddLearningArea({
        learningArea
      });

      const result = reducer(initialState, action);
      expect(result).toEqual(createState([learningArea], false));
    });

    it('should add multiple learningAreas', () => {
      const action = new LearningAreaActions.AddLearningAreas({ learningAreas });
      const result = reducer(initialState, action);

      expect(result).toEqual(createState(learningAreas, false));
    });
  });
  describe('upsert actions', () => {
    it('should upsert one learningArea', () => {
      const originalLearningArea = learningAreas[0];
      
      const startState = reducer(
        initialState,
        new LearningAreaActions.AddLearningArea({
          learningArea: originalLearningArea
        })
      );

    
      const updatedLearningArea = createLearningArea(learningAreas[0].id, 'test');
     
      const action = new LearningAreaActions.UpsertLearningArea({
        learningArea: updatedLearningArea
      });

      const result = reducer(startState, action);

      expect(result.entities[updatedLearningArea.id]).toEqual(updatedLearningArea);
    });

    it('should upsert many learningAreas', () => {
      const startState = createState(learningAreas);

      const learningAreasToInsert = [
        createLearningArea(1),
        createLearningArea(2),
        createLearningArea(3),
        createLearningArea(4)
      ];
      const action = new LearningAreaActions.UpsertLearningAreas({
        learningAreas: learningAreasToInsert
      });

      const result = reducer(startState, action);

      expect(result).toEqual(
        createState(learningAreasToInsert)
      );
    });
  });

  describe('update actions', () => {
    it('should update an learningArea', () => {
      const learningArea = learningAreas[0];
      const startState = createState([learningArea]);
      const update: Update<LearningAreaInterface> = {
        id: 1,
        changes: {
          __EXTRA__PROPERTY_NAME: __EXTRA__PROPERTY_NAMEUpdatedValue
        } 
      };
      const action = new LearningAreaActions.UpdateLearningArea({
        learningArea: update
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([createLearningArea(1, __EXTRA__PROPERTY_NAMEUpdatedValue)]));
    });

    it('should update multiple learningAreas', () => {
      const startState = createState(learningAreas);
      const updates: Update<LearningAreaInterface>[] = [
        
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
      const action = new LearningAreaActions.UpdateLearningAreas({
        learningAreas: updates
      });
      const result = reducer(startState, action);

      expect(result).toEqual(
        createState([createLearningArea(1, __EXTRA__PROPERTY_NAMEUpdatedValue), createLearningArea(2, __EXTRA__PROPERTY_NAMEUpdatedValue), learningAreas[2]])
      );
    });
  });

  describe('delete actions', () => {
    it('should delete one learningArea ', () => {
      const learningArea = learningAreas[0];
      const startState = createState([learningArea]);
      const action = new LearningAreaActions.DeleteLearningArea({
        id: learningArea.id
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([]));
    });

    it('should delete multiple learningAreas', () => {
      const startState = createState(learningAreas);
      const action = new LearningAreaActions.DeleteLearningAreas({
        ids: [learningAreas[0].id, learningAreas[1].id]
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([learningAreas[2]]));
    });
  });

  describe('clear action', () => {
    it('should clear the learningAreas collection', () => {
      const startState = createState(learningAreas, true, 'something went wrong');
      const action = new LearningAreaActions.ClearLearningAreas();
      const result = reducer(startState, action);
      expect(result).toEqual(createState([], true, 'something went wrong'));
    });
  });
});
