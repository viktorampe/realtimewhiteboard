import { ExerciseQueries } from '.';
import { ExerciseInterface } from '../../+models';
import { State } from './exercise.reducer';

describe('Exercise Selectors', () => {
  function createExercise(id: number): ExerciseInterface | any {
    return {
      id: id
    };
  }

  function createState(
    exercises: ExerciseInterface[],
    loaded: boolean = false,
    error?: any
  ): State {
    return {
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
      loaded: loaded,
      error: error
    };
  }

  let exerciseState: State;
  let storeState: any;

  describe('Exercise Selectors', () => {
    beforeEach(() => {
      exerciseState = createState(
        [
          createExercise(4),
          createExercise(1),
          createExercise(2),
          createExercise(3)
        ],
        true,
        'no error'
      );
      storeState = { exercises: exerciseState };
    });
    it('getError() should return the error', () => {
      const results = ExerciseQueries.getError(storeState);
      expect(results).toBe(exerciseState.error);
    });
    it('getLoaded() should return the loaded boolean', () => {
      const results = ExerciseQueries.getLoaded(storeState);
      expect(results).toBe(exerciseState.loaded);
    });
    it('getAll() should return an array of the entities in the order from the ids', () => {
      const results = ExerciseQueries.getAll(storeState);
      expect(results).toEqual([
        createExercise(4),
        createExercise(1),
        createExercise(2),
        createExercise(3)
      ]);
    });
    it('getCount() should return number of entities', () => {
      const results = ExerciseQueries.getCount(storeState);
      expect(results).toBe(4);
    });
    it('getIds() should return an array with ids in the correct order', () => {
      const results = ExerciseQueries.getIds(storeState);
      expect(results).toEqual([4, 1, 2, 3]);
    });
    it('getAllEntities() should return a key value object with all the entities', () => {
      const results = ExerciseQueries.getAllEntities(storeState);
      expect(results).toEqual(exerciseState.entities);
    });
    it('getByIds() should return an array of the requested entities in order and undefined if the id is not present', () => {
      const results = ExerciseQueries.getByIds(storeState, {
        ids: [3, 1, 90, 2]
      });
      expect(results).toEqual([
        createExercise(3),
        createExercise(1),
        undefined,
        createExercise(2)
      ]);
    });
    it('getById() should return the desired entity', () => {
      const results = ExerciseQueries.getById(storeState, { id: 2 });
      expect(results).toEqual(createExercise(2));
    });
    it('getById() should return undefined if the entity is not present', () => {
      const results = ExerciseQueries.getById(storeState, { id: 9 });
      expect(results).toBe(undefined);
    });
  });
});
