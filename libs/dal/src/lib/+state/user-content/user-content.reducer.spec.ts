import { Update } from '@ngrx/entity';
import { UserContentActions } from '.';
import { UserContentInterface } from '../../+models';
import { initialState, reducer, State } from './user-content.reducer';

/**
 * This file is scaffolded, but needs some special attention:
 * - find and replace 'description' and replace this with a property name of the UserContent entity.
 * - set the initial property value via '[description]InitialValue'.
 * - set the updated property value via '[description]UpdatedValue'.
 */
const descriptionInitialValue = 'I like UR schematics';
const descriptionUpdatedValue = 'I <3 UR schematics';

/**
 * Creates a UserContent.
 * @param {number} id
 * @returns {UserContentInterface}
 */
function createUserContent(
  id: number,
  description: any = descriptionInitialValue
): UserContentInterface | any {
  return {
    id: id,
    description: description
  };
}

/**
 * Utility to create the user-content state.
 *
 * @param {UserContentInterface[]} userContents
 * @param {boolean} [loaded]
 * @param {*} [error]
 * @returns {State}
 */
function createState(
  userContents: UserContentInterface[],
  loaded: boolean = false,
  error?: any
): State {
  const state: any = {
    ids: userContents ? userContents.map(userContent => userContent.id) : [],
    entities: userContents
      ? userContents.reduce(
          (entityMap, userContent) => ({
            ...entityMap,
            [userContent.id]: userContent
          }),
          {}
        )
      : {},
    loaded: loaded
  };
  if (error !== undefined) state.error = error;
  return state;
}

describe('UserContents Reducer', () => {
  let userContents: UserContentInterface[];
  beforeEach(() => {
    userContents = [
      createUserContent(1),
      createUserContent(2),
      createUserContent(3)
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
    it('should load all userContents', () => {
      const action = new UserContentActions.UserContentsLoaded({
        userContents
      });
      const result = reducer(initialState, action);
      expect(result).toEqual(createState(userContents, true));
    });

    it('should error', () => {
      const error = 'Something went wrong';
      const action = new UserContentActions.UserContentsLoadError(error);
      const result = reducer(initialState, action);
      expect(result).toEqual(createState([], false, error));
    });
  });

  describe('add actions', () => {
    it('should add one userContent', () => {
      const userContent = userContents[0];
      const action = new UserContentActions.AddUserContent({
        userContent
      });

      const result = reducer(initialState, action);
      expect(result).toEqual(createState([userContent], false));
    });

    it('should add multiple userContents', () => {
      const action = new UserContentActions.AddUserContents({ userContents });
      const result = reducer(initialState, action);

      expect(result).toEqual(createState(userContents, false));
    });
  });
  describe('upsert actions', () => {
    it('should upsert one userContent', () => {
      const originalUserContent = userContents[0];

      const startState = reducer(
        initialState,
        new UserContentActions.AddUserContent({
          userContent: originalUserContent
        })
      );

      const updatedUserContent = createUserContent(userContents[0].id, 'test');

      const action = new UserContentActions.UpsertUserContent({
        userContent: updatedUserContent
      });

      const result = reducer(startState, action);

      expect(result.entities[updatedUserContent.id]).toEqual(
        updatedUserContent
      );
    });

    it('should upsert many userContents', () => {
      const startState = createState(userContents);

      const userContentsToInsert = [
        createUserContent(1),
        createUserContent(2),
        createUserContent(3),
        createUserContent(4)
      ];
      const action = new UserContentActions.UpsertUserContents({
        userContents: userContentsToInsert
      });

      const result = reducer(startState, action);

      expect(result).toEqual(createState(userContentsToInsert));
    });
  });

  describe('update actions', () => {
    it('should update an userContent', () => {
      const userContent = userContents[0];
      const startState = createState([userContent]);
      const update: Update<UserContentInterface> = {
        id: 1,
        changes: {
          description: descriptionUpdatedValue
        }
      };
      const action = new UserContentActions.UpdateUserContent({
        userContent: update
      });
      const result = reducer(startState, action);
      expect(result).toEqual(
        createState([createUserContent(1, descriptionUpdatedValue)])
      );
    });

    it('should update multiple userContents', () => {
      const startState = createState(userContents);
      const updates: Update<UserContentInterface>[] = [
        {
          id: 1,
          changes: {
            description: descriptionUpdatedValue
          }
        },
        {
          id: 2,
          changes: {
            description: descriptionUpdatedValue
          }
        }
      ];
      const action = new UserContentActions.UpdateUserContents({
        userContents: updates
      });
      const result = reducer(startState, action);

      expect(result).toEqual(
        createState([
          createUserContent(1, descriptionUpdatedValue),
          createUserContent(2, descriptionUpdatedValue),
          userContents[2]
        ])
      );
    });
  });

  describe('delete actions', () => {
    it('should delete one userContent ', () => {
      const userContent = userContents[0];
      const startState = createState([userContent]);
      const action = new UserContentActions.DeleteUserContent({
        id: userContent.id
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([]));
    });

    it('should delete multiple userContents', () => {
      const startState = createState(userContents);
      const action = new UserContentActions.DeleteUserContents({
        ids: [userContents[0].id, userContents[1].id]
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([userContents[2]]));
    });
  });

  describe('clear action', () => {
    it('should clear the userContents collection', () => {
      const startState = createState(
        userContents,
        true,
        'something went wrong'
      );
      const action = new UserContentActions.ClearUserContents();
      const result = reducer(startState, action);
      expect(result).toEqual(createState([], true, 'something went wrong'));
    });
  });
});
