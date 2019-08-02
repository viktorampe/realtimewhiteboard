import { UserLessonQueries } from '.';
import { UserLessonInterface } from '../../+models';
import { State } from './user-lesson.reducer';

describe('UserLesson Selectors', () => {
  function createUserLesson(id: number): UserLessonInterface | any {
    return {
      id: id
    };
  }

  function createState(
    userLessons: UserLessonInterface[],
    loaded: boolean = false,
    error?: any
  ): State {
    return {
      ids: userLessons ? userLessons.map(userLesson => userLesson.id) : [],
      entities: userLessons
        ? userLessons.reduce(
            (entityMap, userLesson) => ({
              ...entityMap,
              [userLesson.id]: userLesson
            }),
            {}
          )
        : {},
      loaded: loaded,
      error: error
    };
  }

  let userLessonState: State;
  let storeState: any;

  describe('UserLesson Selectors', () => {
    beforeEach(() => {
      userLessonState = createState(
        [
          createUserLesson(4),
          createUserLesson(1),
          createUserLesson(2),
          createUserLesson(3)
        ],
        true,
        'no error'
      );
      storeState = { userLessons: userLessonState };
    });
    it('getError() should return the error', () => {
      const results = UserLessonQueries.getError(storeState);
      expect(results).toBe(userLessonState.error);
    });
    it('getLoaded() should return the loaded boolean', () => {
      const results = UserLessonQueries.getLoaded(storeState);
      expect(results).toBe(userLessonState.loaded);
    });
    it('getAll() should return an array of the entities in the order from the ids', () => {
      const results = UserLessonQueries.getAll(storeState);
      expect(results).toEqual([
        createUserLesson(4),
        createUserLesson(1),
        createUserLesson(2),
        createUserLesson(3)
      ]);
    });
    it('getCount() should return number of entities', () => {
      const results = UserLessonQueries.getCount(storeState);
      expect(results).toBe(4);
    });
    it('getIds() should return an array with ids in the correct order', () => {
      const results = UserLessonQueries.getIds(storeState);
      expect(results).toEqual([4, 1, 2, 3]);
    });
    it('getAllEntities() should return a key value object with all the entities', () => {
      const results = UserLessonQueries.getAllEntities(storeState);
      expect(results).toEqual(userLessonState.entities);
    });
    it('getByIds() should return an array of the requested entities in order and undefined if the id is not present', () => {
      const results = UserLessonQueries.getByIds(storeState, {
        ids: [3, 1, 90, 2]
      });
      expect(results).toEqual([
        createUserLesson(3),
        createUserLesson(1),
        undefined,
        createUserLesson(2)
      ]);
    });
    it('getById() should return the desired entity', () => {
      const results = UserLessonQueries.getById(storeState, { id: 2 });
      expect(results).toEqual(createUserLesson(2));
    });
    it('getById() should return undefined if the entity is not present', () => {
      const results = UserLessonQueries.getById(storeState, { id: 9 });
      expect(results).toBe(undefined);
    });
  });
});
