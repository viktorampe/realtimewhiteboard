import { Update } from '@ngrx/entity';
import {ExerciseActions } from '.';
import { initialState, reducer, State } from './exercise.reducer';
import { ExerciseInterface } from '../../+models';

/** 
 * This file is scaffolded, but needs some special attention:
 * - find and replace '__EXTRA__PROPERTY_NAME' and replace this with a property name of the Exercise entity.
 * - set the initial property value via '[__EXTRA__PROPERTY_NAME]InitialValue'.
 * - set the updated property value via '[__EXTRA__PROPERTY_NAME]UpdatedValue'.
*/
const __EXTRA__PROPERTY_NAMEInitialValue = ;
const __EXTRA__PROPERTY_NAMEUpdatedValue = ;

/**
 * Creates a Exercise.
 * @param {number} id
 * @returns {ExerciseInterface}
 */
function createExercise(id: number, __EXTRA__PROPERTY_NAME:any = __EXTRA__PROPERTY_NAMEInitialValue): ExerciseInterface | any {
  return {
    id: id,
    __EXTRA__PROPERTY_NAME: __EXTRA__PROPERTY_NAME
  };
}

/**
 * Utility to create the exercise state.
 *
 * @param {ExerciseInterface[]} exercises
 * @param {boolean} [loaded]
 * @param {*} [error]
 * @returns {State}
 */
function createState(
  exercises: ExerciseInterface[],
  loaded: boolean = false,
  error?: any
): State {
  const state: any = {
    ids: exercises ? exercises.map(exercise => exercise.id) : [],
    entities: exercises
      ? exercises.reduce(
          (entityMap, exercise) => ({
            ...entityMap,
            [exercise.id]: exercise
          }),
          {}
        )
      : {},
    loaded: loaded
  };
  if (error !== undefined) state.error = error;
  return state;
}


describe('Exercises Reducer', () => {
  let exercises: ExerciseInterface[];
  beforeEach(() => {
    exercises = [
      createExercise(1),
      createExercise(2),
      createExercise(3)
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
    it('should load all exercises', () => {
      const action = new ExerciseActions.ExercisesLoaded({ exercises });
      const result = reducer(initialState, action);
      expect(result).toEqual(createState(exercises, true));
    });

    it('should error', () => {
      const error = 'Something went wrong';
      const action = new ExerciseActions.ExercisesLoadError(error);
      const result = reducer(initialState, action);
      expect(result).toEqual(createState([], false, error));
    });
  });

  describe('add actions', () => {
    it('should add one exercise', () => {
      const exercise = exercises[0];
      const action = new ExerciseActions.AddExercise({
        exercise
      });

      const result = reducer(initialState, action);
      expect(result).toEqual(createState([exercise], false));
    });

    it('should add multiple exercises', () => {
      const action = new ExerciseActions.AddExercises({ exercises });
      const result = reducer(initialState, action);

      expect(result).toEqual(createState(exercises, false));
    });
  });
  describe('upsert actions', () => {
    it('should upsert one exercise', () => {
      const originalExercise = exercises[0];
      
      const startState = reducer(
        initialState,
        new ExerciseActions.AddExercise({
          exercise: originalExercise
        })
      );

    
      const updatedExercise = createExercise(exercises[0].id, 'test');
     
      const action = new ExerciseActions.UpsertExercise({
        exercise: updatedExercise
      });

      const result = reducer(startState, action);

      expect(result.entities[updatedExercise.id]).toEqual(updatedExercise);
    });

    it('should upsert many exercises', () => {
      const startState = createState(exercises);

      const exercisesToInsert = [
        createExercise(1),
        createExercise(2),
        createExercise(3),
        createExercise(4)
      ];
      const action = new ExerciseActions.UpsertExercises({
        exercises: exercisesToInsert
      });

      const result = reducer(startState, action);

      expect(result).toEqual(
        createState(exercisesToInsert)
      );
    });
  });

  describe('update actions', () => {
    it('should update an exercise', () => {
      const exercise = exercises[0];
      const startState = createState([exercise]);
      const update: Update<ExerciseInterface> = {
        id: 1,
        changes: {
          __EXTRA__PROPERTY_NAME: __EXTRA__PROPERTY_NAMEUpdatedValue
        } 
      };
      const action = new ExerciseActions.UpdateExercise({
        exercise: update
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([createExercise(1, __EXTRA__PROPERTY_NAMEUpdatedValue)]));
    });

    it('should update multiple exercises', () => {
      const startState = createState(exercises);
      const updates: Update<ExerciseInterface>[] = [
        
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
      const action = new ExerciseActions.UpdateExercises({
        exercises: updates
      });
      const result = reducer(startState, action);

      expect(result).toEqual(
        createState([createExercise(1, __EXTRA__PROPERTY_NAMEUpdatedValue), createExercise(2, __EXTRA__PROPERTY_NAMEUpdatedValue), exercises[2]])
      );
    });
  });

  describe('delete actions', () => {
    it('should delete one exercise ', () => {
      const exercise = exercises[0];
      const startState = createState([exercise]);
      const action = new ExerciseActions.DeleteExercise({
        id: exercise.id
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([]));
    });

    it('should delete multiple exercises', () => {
      const startState = createState(exercises);
      const action = new ExerciseActions.DeleteExercises({
        ids: [exercises[0].id, exercises[1].id]
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([exercises[2]]));
    });
  });

  describe('clear action', () => {
    it('should clear the exercises collection', () => {
      const startState = createState(exercises, true, 'something went wrong');
      const action = new ExerciseActions.ClearExercises();
      const result = reducer(startState, action);
      expect(result).toEqual(createState([], true, 'something went wrong'));
    });
  });
});
