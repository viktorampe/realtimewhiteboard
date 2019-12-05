import { TaskStudentQueries } from '.';
import { TaskStudentInterface } from '../../+models';
import { State } from './task-student.reducer';

describe('TaskStudent Selectors', () => {
  function createTaskStudent(id: number): TaskStudentInterface | any {
    return {
      id: id
    };
  }

  function createState(
    taskStudents: TaskStudentInterface[],
    loaded: boolean = false,
    error?: any
  ): State {
    return {
      ids: taskStudents ? taskStudents.map(taskStudent => taskStudent.id) : [],
      entities: taskStudents
        ? taskStudents.reduce(
            (entityMap, taskStudent) => ({
              ...entityMap,
              [taskStudent.id]: taskStudent
            }),
            {}
          )
        : {},
      loaded: loaded,
      error: error
    };
  }

  let taskStudentState: State;
  let storeState: any;

  describe('TaskStudent Selectors', () => {
    beforeEach(() => {
      taskStudentState = createState(
        [
          createTaskStudent(4),
          createTaskStudent(1),
          createTaskStudent(2),
          createTaskStudent(3)
        ],
        true,
        'no error'
      );
      storeState = { taskStudents: taskStudentState };
    });
    it('getError() should return the error', () => {
      const results = TaskStudentQueries.getError(storeState);
      expect(results).toBe(taskStudentState.error);
    });
    it('getLoaded() should return the loaded boolean', () => {
      const results = TaskStudentQueries.getLoaded(storeState);
      expect(results).toBe(taskStudentState.loaded);
    });
    it('getAll() should return an array of the entities in the order from the ids', () => {
      const results = TaskStudentQueries.getAll(storeState);
      expect(results).toEqual([
        createTaskStudent(4),
        createTaskStudent(1),
        createTaskStudent(2),
        createTaskStudent(3)
      ]);
    });
    it('getCount() should return number of entities', () => {
      const results = TaskStudentQueries.getCount(storeState);
      expect(results).toBe(4);
    });
    it('getIds() should return an array with ids in the correct order', () => {
      const results = TaskStudentQueries.getIds(storeState);
      expect(results).toEqual([4, 1, 2, 3]);
    });
    it('getAllEntities() should return a key value object with all the entities', () => {
      const results = TaskStudentQueries.getAllEntities(storeState);
      expect(results).toEqual(taskStudentState.entities);
    });
    it('getByIds() should return an array of the requested entities in order and undefined if the id is not present', () => {
      const results = TaskStudentQueries.getByIds(storeState, {
        ids: [3, 1, 90, 2]
      });
      expect(results).toEqual([
        createTaskStudent(3),
        createTaskStudent(1),
        undefined,
        createTaskStudent(2)
      ]);
    });
    it('getById() should return the desired entity', () => {
      const results = TaskStudentQueries.getById(storeState, { id: 2 });
      expect(results).toEqual(createTaskStudent(2));
    });
    it('getById() should return undefined if the entity is not present', () => {
      const results = TaskStudentQueries.getById(storeState, { id: 9 });
      expect(results).toBe(undefined);
    });
  });
});
