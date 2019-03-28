import { TeacherStudentQueries } from '.';
import { TeacherStudentFixture } from '../../+fixtures';
import { TeacherStudentInterface } from '../../+models';
import { TeacherStudentsLoaded } from './teacher-student.actions';
import {
  initialState,
  reducer as TeacherStudentReducer,
  State
} from './teacher-student.reducer';
import { getCoupledTeacherIds } from './teacher-student.selectors';

describe('TeacherStudent Selectors', () => {
  const date = new Date();
  function createTeacherStudent(id: number): TeacherStudentInterface | any {
    return new TeacherStudentFixture({
      created: date,
      id: id,
      teacherId: id + 1,
      studentId: id + 2
    });
  }

  function createState(
    teacherStudents: TeacherStudentInterface[],
    loaded: boolean = false,
    error?: any
  ): State {
    return {
      ids: teacherStudents
        ? teacherStudents.map(TeacherStudent => TeacherStudent.id)
        : [],
      entities: teacherStudents
        ? teacherStudents.reduce(
            (entityMap, TeacherStudent) => ({
              ...entityMap,
              [TeacherStudent.id]: TeacherStudent
            }),
            {}
          )
        : {},
      loaded: loaded,
      error: error
    };
  }

  let teacherStudentstate: State;
  let storeState: any;

  describe('TeacherStudent Selectors', () => {
    beforeEach(() => {
      teacherStudentstate = createState(
        [
          createTeacherStudent(4),
          createTeacherStudent(1),
          createTeacherStudent(2),
          createTeacherStudent(3)
        ],
        true,
        'no error'
      );
      storeState = { teacherStudents: teacherStudentstate };
    });
    it('getError() should return the error', () => {
      const results = TeacherStudentQueries.getError(storeState);
      expect(results).toBe(teacherStudentstate.error);
    });
    it('getLoaded() should return the loaded boolean', () => {
      const results = TeacherStudentQueries.getLoaded(storeState);
      expect(results).toBe(teacherStudentstate.loaded);
    });
    it('getAll() should return an array of the entities in the order from the ids', () => {
      const results = TeacherStudentQueries.getAll(storeState);
      expect(results).toEqual([
        createTeacherStudent(4),
        createTeacherStudent(1),
        createTeacherStudent(2),
        createTeacherStudent(3)
      ]);
    });
    it('getCount() should return number of entities', () => {
      const results = TeacherStudentQueries.getCount(storeState);
      expect(results).toBe(4);
    });
    it('getIds() should return an array with ids in the correct order', () => {
      const results = TeacherStudentQueries.getIds(storeState);
      expect(results).toEqual([4, 1, 2, 3]);
    });
    it('getAllEntities() should return a key value object with all the entities', () => {
      const results = TeacherStudentQueries.getAllEntities(storeState);
      expect(results).toEqual(teacherStudentstate.entities);
    });
    it('getByIds() should return an array of the requested entities in order and undefined if the id is not present', () => {
      const results = TeacherStudentQueries.getByIds(storeState, {
        ids: [3, 1, 90, 2]
      });
      expect(results).toEqual([
        createTeacherStudent(3),
        createTeacherStudent(1),
        undefined,
        createTeacherStudent(2)
      ]);
    });
    it('getById() should return the desired entity', () => {
      const results = TeacherStudentQueries.getById(storeState, { id: 2 });
      expect(results).toEqual(createTeacherStudent(2));
    });
    it('getById() should return undefined if the entity is not present', () => {
      const results = TeacherStudentQueries.getById(storeState, { id: 9 });
      expect(results).toBe(undefined);
    });
    it('getTeacherStudentIds() should return number[] of the persons that are linked', () => {
      const results = TeacherStudentQueries.getTeacherIdsFromTeacherStudents(
        storeState
      );
      expect(results).toEqual([2, 3, 4, 5]);
    });

    it('should return coupled teacherIds except own userId', () => {
      const action = new TeacherStudentsLoaded({
        teacherStudents: [
          new TeacherStudentFixture({ studentId: 2, teacherId: 4 }),
          new TeacherStudentFixture({ studentId: 3, teacherId: 4 }),
          new TeacherStudentFixture({ studentId: 4, teacherId: 3 })
        ]
      });
      const state = TeacherStudentReducer(initialState, action);
      expect(getCoupledTeacherIds.projector(state, { userId: 3 })).toEqual([4]);
    });
  });
});
