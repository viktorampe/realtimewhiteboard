import { Update } from '@ngrx/entity';
import {UserLessonActions } from '.';
import { initialState, reducer, State } from './user-lesson.reducer';
import { UserLessonInterface } from '../../+models';

/** 
 * This file is scaffolded, but needs some special attention:
 * - find and replace '__EXTRA__PROPERTY_NAME' and replace this with a property name of the UserLesson entity.
 * - set the initial property value via '[__EXTRA__PROPERTY_NAME]InitialValue'.
 * - set the updated property value via '[__EXTRA__PROPERTY_NAME]UpdatedValue'.
*/
const __EXTRA__PROPERTY_NAMEInitialValue = ;
const __EXTRA__PROPERTY_NAMEUpdatedValue = ;

/**
 * Creates a UserLesson.
 * @param {number} id
 * @returns {UserLessonInterface}
 */
function createUserLesson(id: number, __EXTRA__PROPERTY_NAME:any = __EXTRA__PROPERTY_NAMEInitialValue): UserLessonInterface | any {
  return {
    id: id,
    __EXTRA__PROPERTY_NAME: __EXTRA__PROPERTY_NAME
  };
}

/**
 * Utility to create the user-lesson state.
 *
 * @param {UserLessonInterface[]} userLessons
 * @param {boolean} [loaded]
 * @param {*} [error]
 * @returns {State}
 */
function createState(
  userLessons: UserLessonInterface[],
  loaded: boolean = false,
  error?: any
): State {
  const state: any = {
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
    loaded: loaded
  };
  if (error !== undefined) state.error = error;
  return state;
}


describe('UserLessons Reducer', () => {
  let userLessons: UserLessonInterface[];
  beforeEach(() => {
    userLessons = [
      createUserLesson(1),
      createUserLesson(2),
      createUserLesson(3)
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
    it('should load all userLessons', () => {
      const action = new UserLessonActions.UserLessonsLoaded({ userLessons });
      const result = reducer(initialState, action);
      expect(result).toEqual(createState(userLessons, true));
    });

    it('should error', () => {
      const error = 'Something went wrong';
      const action = new UserLessonActions.UserLessonsLoadError(error);
      const result = reducer(initialState, action);
      expect(result).toEqual(createState([], false, error));
    });
  });

  describe('add actions', () => {
    it('should add one userLesson', () => {
      const userLesson = userLessons[0];
      const action = new UserLessonActions.AddUserLesson({
        userLesson
      });

      const result = reducer(initialState, action);
      expect(result).toEqual(createState([userLesson], false));
    });

    it('should add multiple userLessons', () => {
      const action = new UserLessonActions.AddUserLessons({ userLessons });
      const result = reducer(initialState, action);

      expect(result).toEqual(createState(userLessons, false));
    });
  });
  describe('upsert actions', () => {
    it('should upsert one userLesson', () => {
      const originalUserLesson = userLessons[0];
      
      const startState = reducer(
        initialState,
        new UserLessonActions.AddUserLesson({
          userLesson: originalUserLesson
        })
      );

    
      const updatedUserLesson = createUserLesson(userLessons[0].id, 'test');
     
      const action = new UserLessonActions.UpsertUserLesson({
        userLesson: updatedUserLesson
      });

      const result = reducer(startState, action);

      expect(result.entities[updatedUserLesson.id]).toEqual(updatedUserLesson);
    });

    it('should upsert many userLessons', () => {
      const startState = createState(userLessons);

      const userLessonsToInsert = [
        createUserLesson(1),
        createUserLesson(2),
        createUserLesson(3),
        createUserLesson(4)
      ];
      const action = new UserLessonActions.UpsertUserLessons({
        userLessons: userLessonsToInsert
      });

      const result = reducer(startState, action);

      expect(result).toEqual(
        createState(userLessonsToInsert)
      );
    });
  });

  describe('update actions', () => {
    it('should update an userLesson', () => {
      const userLesson = userLessons[0];
      const startState = createState([userLesson]);
      const update: Update<UserLessonInterface> = {
        id: 1,
        changes: {
          __EXTRA__PROPERTY_NAME: __EXTRA__PROPERTY_NAMEUpdatedValue
        } 
      };
      const action = new UserLessonActions.UpdateUserLesson({
        userLesson: update
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([createUserLesson(1, __EXTRA__PROPERTY_NAMEUpdatedValue)]));
    });

    it('should update multiple userLessons', () => {
      const startState = createState(userLessons);
      const updates: Update<UserLessonInterface>[] = [
        
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
      const action = new UserLessonActions.UpdateUserLessons({
        userLessons: updates
      });
      const result = reducer(startState, action);

      expect(result).toEqual(
        createState([createUserLesson(1, __EXTRA__PROPERTY_NAMEUpdatedValue), createUserLesson(2, __EXTRA__PROPERTY_NAMEUpdatedValue), userLessons[2]])
      );
    });
  });

  describe('delete actions', () => {
    it('should delete one userLesson ', () => {
      const userLesson = userLessons[0];
      const startState = createState([userLesson]);
      const action = new UserLessonActions.DeleteUserLesson({
        id: userLesson.id
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([]));
    });

    it('should delete multiple userLessons', () => {
      const startState = createState(userLessons);
      const action = new UserLessonActions.DeleteUserLessons({
        ids: [userLessons[0].id, userLessons[1].id]
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([userLessons[2]]));
    });
  });

  describe('clear action', () => {
    it('should clear the userLessons collection', () => {
      const startState = createState(userLessons, true, 'something went wrong');
      const action = new UserLessonActions.ClearUserLessons();
      const result = reducer(startState, action);
      expect(result).toEqual(createState([], true, 'something went wrong'));
    });
  });
});
