import { Update } from '@ngrx/entity';
import {LearningPlanGoalActions } from '.';
import { initialState, reducer, State } from './learning-plan-goal.reducer';
import { LearningPlanGoalInterface } from '../../+models';

/** 
 * This file is scaffolded, but needs some special attention:
 * - find and replace '__EXTRA__PROPERTY_NAME' and replace this with a property name of the LearningPlanGoal entity.
 * - set the initial property value via '[__EXTRA__PROPERTY_NAME]InitialValue'.
 * - set the updated property value via '[__EXTRA__PROPERTY_NAME]UpdatedValue'.
*/
const __EXTRA__PROPERTY_NAMEInitialValue = ;
const __EXTRA__PROPERTY_NAMEUpdatedValue = ;

/**
 * Creates a LearningPlanGoal.
 * @param {number} id
 * @returns {LearningPlanGoalInterface}
 */
function createLearningPlanGoal(id: number, __EXTRA__PROPERTY_NAME:any = __EXTRA__PROPERTY_NAMEInitialValue): LearningPlanGoalInterface | any {
  return {
    id: id,
    __EXTRA__PROPERTY_NAME: __EXTRA__PROPERTY_NAME
  };
}

/**
 * Utility to create the learning-plan-goal state.
 *
 * @param {LearningPlanGoalInterface[]} learningPlanGoals
 * @param {boolean} [loaded]
 * @param {*} [error]
 * @returns {State}
 */
function createState(
  learningPlanGoals: LearningPlanGoalInterface[],
  loaded: boolean = false,
  error?: any
): State {
  const state: any = {
    ids: learningPlanGoals ? learningPlanGoals.map(learningPlanGoal => learningPlanGoal.id) : [],
    entities: learningPlanGoals
      ? learningPlanGoals.reduce(
          (entityMap, learningPlanGoal) => ({
            ...entityMap,
            [learningPlanGoal.id]: learningPlanGoal
          }),
          {}
        )
      : {},
    loaded: loaded
  };
  if (error !== undefined) state.error = error;
  return state;
}


describe('LearningPlanGoals Reducer', () => {
  let learningPlanGoals: LearningPlanGoalInterface[];
  beforeEach(() => {
    learningPlanGoals = [
      createLearningPlanGoal(1),
      createLearningPlanGoal(2),
      createLearningPlanGoal(3)
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
    it('should load all learningPlanGoals', () => {
      const action = new LearningPlanGoalActions.LearningPlanGoalsLoaded({ learningPlanGoals });
      const result = reducer(initialState, action);
      expect(result).toEqual(createState(learningPlanGoals, true));
    });

    it('should error', () => {
      const error = 'Something went wrong';
      const action = new LearningPlanGoalActions.LearningPlanGoalsLoadError(error);
      const result = reducer(initialState, action);
      expect(result).toEqual(createState([], false, error));
    });
  });

  describe('add actions', () => {
    it('should add one learningPlanGoal', () => {
      const learningPlanGoal = learningPlanGoals[0];
      const action = new LearningPlanGoalActions.AddLearningPlanGoal({
        learningPlanGoal
      });

      const result = reducer(initialState, action);
      expect(result).toEqual(createState([learningPlanGoal], false));
    });

    it('should add multiple learningPlanGoals', () => {
      const action = new LearningPlanGoalActions.AddLearningPlanGoals({ learningPlanGoals });
      const result = reducer(initialState, action);

      expect(result).toEqual(createState(learningPlanGoals, false));
    });
  });
  describe('upsert actions', () => {
    it('should upsert one learningPlanGoal', () => {
      const originalLearningPlanGoal = learningPlanGoals[0];
      
      const startState = reducer(
        initialState,
        new LearningPlanGoalActions.AddLearningPlanGoal({
          learningPlanGoal: originalLearningPlanGoal
        })
      );

    
      const updatedLearningPlanGoal = createLearningPlanGoal(learningPlanGoals[0].id, 'test');
     
      const action = new LearningPlanGoalActions.UpsertLearningPlanGoal({
        learningPlanGoal: updatedLearningPlanGoal
      });

      const result = reducer(startState, action);

      expect(result.entities[updatedLearningPlanGoal.id]).toEqual(updatedLearningPlanGoal);
    });

    it('should upsert many learningPlanGoals', () => {
      const startState = createState(learningPlanGoals);

      const learningPlanGoalsToInsert = [
        createLearningPlanGoal(1),
        createLearningPlanGoal(2),
        createLearningPlanGoal(3),
        createLearningPlanGoal(4)
      ];
      const action = new LearningPlanGoalActions.UpsertLearningPlanGoals({
        learningPlanGoals: learningPlanGoalsToInsert
      });

      const result = reducer(startState, action);

      expect(result).toEqual(
        createState(learningPlanGoalsToInsert)
      );
    });
  });

  describe('update actions', () => {
    it('should update an learningPlanGoal', () => {
      const learningPlanGoal = learningPlanGoals[0];
      const startState = createState([learningPlanGoal]);
      const update: Update<LearningPlanGoalInterface> = {
        id: 1,
        changes: {
          __EXTRA__PROPERTY_NAME: __EXTRA__PROPERTY_NAMEUpdatedValue
        } 
      };
      const action = new LearningPlanGoalActions.UpdateLearningPlanGoal({
        learningPlanGoal: update
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([createLearningPlanGoal(1, __EXTRA__PROPERTY_NAMEUpdatedValue)]));
    });

    it('should update multiple learningPlanGoals', () => {
      const startState = createState(learningPlanGoals);
      const updates: Update<LearningPlanGoalInterface>[] = [
        
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
      const action = new LearningPlanGoalActions.UpdateLearningPlanGoals({
        learningPlanGoals: updates
      });
      const result = reducer(startState, action);

      expect(result).toEqual(
        createState([createLearningPlanGoal(1, __EXTRA__PROPERTY_NAMEUpdatedValue), createLearningPlanGoal(2, __EXTRA__PROPERTY_NAMEUpdatedValue), learningPlanGoals[2]])
      );
    });
  });

  describe('delete actions', () => {
    it('should delete one learningPlanGoal ', () => {
      const learningPlanGoal = learningPlanGoals[0];
      const startState = createState([learningPlanGoal]);
      const action = new LearningPlanGoalActions.DeleteLearningPlanGoal({
        id: learningPlanGoal.id
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([]));
    });

    it('should delete multiple learningPlanGoals', () => {
      const startState = createState(learningPlanGoals);
      const action = new LearningPlanGoalActions.DeleteLearningPlanGoals({
        ids: [learningPlanGoals[0].id, learningPlanGoals[1].id]
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([learningPlanGoals[2]]));
    });
  });

  describe('clear action', () => {
    it('should clear the learningPlanGoals collection', () => {
      const startState = createState(learningPlanGoals, true, 'something went wrong');
      const action = new LearningPlanGoalActions.ClearLearningPlanGoals();
      const result = reducer(startState, action);
      expect(result).toEqual(createState([], true, 'something went wrong'));
    });
  });
});
