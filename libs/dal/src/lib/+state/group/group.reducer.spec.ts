import { Update } from '@ngrx/entity';
import { GroupActions } from '.';
import { GroupInterface } from '../../+models';
import { initialState, reducer, State } from './group.reducer';

const teacherIdInitialValue = 123;
const teacherIdUpdatedValue = 456;

/**
 * Creates a Group.
 * @param {number} id
 * @returns {GroupInterface}
 */
function createGroup(
  id: number,
  teacherId: any = teacherIdInitialValue
): GroupInterface | any {
  return {
    id: id,
    teacherId: teacherId
  };
}

/**
 * Utility to create the group state.
 *
 * @param {GroupInterface[]} groups
 * @param {boolean} [loaded]
 * @param {*} [error]
 * @returns {State}
 */
function createState(
  groups: GroupInterface[],
  loaded: boolean = false,
  error?: any
): State {
  const state: any = {
    ids: groups ? groups.map(group => group.id) : [],
    entities: groups
      ? groups.reduce(
          (entityMap, group) => ({
            ...entityMap,
            [group.id]: group
          }),
          {}
        )
      : {},
    loaded: loaded
  };
  if (error !== undefined) state.error = error;
  return state;
}

describe('Groups Reducer', () => {
  let groups: GroupInterface[];
  beforeEach(() => {
    groups = [createGroup(1), createGroup(2), createGroup(3)];
  });

  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });

  describe('loaded action', () => {
    it('should load all groups', () => {
      const action = new GroupActions.GroupsLoaded({ groups });
      const result = reducer(initialState, action);
      expect(result).toEqual(createState(groups, true));
    });

    it('should error', () => {
      const error = 'Something went wrong';
      const action = new GroupActions.GroupsLoadError(error);
      const result = reducer(initialState, action);
      expect(result).toEqual(createState([], false, error));
    });
  });

  describe('add actions', () => {
    it('should add one group', () => {
      const group = groups[0];
      const action = new GroupActions.AddGroup({
        group
      });

      const result = reducer(initialState, action);
      expect(result).toEqual(createState([group], false));
    });

    it('should add multiple groups', () => {
      const action = new GroupActions.AddGroups({ groups });
      const result = reducer(initialState, action);

      expect(result).toEqual(createState(groups, false));
    });
  });
  describe('upsert actions', () => {
    it('should upsert one group', () => {
      const originalGroup = groups[0];

      const startState = reducer(
        initialState,
        new GroupActions.AddGroup({
          group: originalGroup
        })
      );

      const updatedGroup = createGroup(groups[0].id, 'test');

      const action = new GroupActions.UpsertGroup({
        group: updatedGroup
      });

      const result = reducer(startState, action);

      expect(result.entities[updatedGroup.id]).toEqual(updatedGroup);
    });

    it('should upsert many groups', () => {
      const startState = createState(groups);

      const groupsToInsert = [
        createGroup(1),
        createGroup(2),
        createGroup(3),
        createGroup(4)
      ];
      const action = new GroupActions.UpsertGroups({
        groups: groupsToInsert
      });

      const result = reducer(startState, action);

      expect(result).toEqual(createState(groupsToInsert));
    });
  });

  describe('update actions', () => {
    it('should update an group', () => {
      const group = groups[0];
      const startState = createState([group]);
      const update: Update<GroupInterface> = {
        id: 1,
        changes: {
          teacherId: teacherIdUpdatedValue
        }
      };
      const action = new GroupActions.UpdateGroup({
        group: update
      });
      const result = reducer(startState, action);
      expect(result).toEqual(
        createState([createGroup(1, teacherIdUpdatedValue)])
      );
    });

    it('should update multiple groups', () => {
      const startState = createState(groups);
      const updates: Update<GroupInterface>[] = [
        {
          id: 1,
          changes: {
            teacherId: teacherIdUpdatedValue
          }
        },
        {
          id: 2,
          changes: {
            teacherId: teacherIdUpdatedValue
          }
        }
      ];
      const action = new GroupActions.UpdateGroups({
        groups: updates
      });
      const result = reducer(startState, action);

      expect(result).toEqual(
        createState([
          createGroup(1, teacherIdUpdatedValue),
          createGroup(2, teacherIdUpdatedValue),
          groups[2]
        ])
      );
    });
  });

  describe('delete actions', () => {
    it('should delete one group ', () => {
      const group = groups[0];
      const startState = createState([group]);
      const action = new GroupActions.DeleteGroup({
        id: group.id
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([]));
    });

    it('should delete multiple groups', () => {
      const startState = createState(groups);
      const action = new GroupActions.DeleteGroups({
        ids: [groups[0].id, groups[1].id]
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([groups[2]]));
    });
  });

  describe('clear action', () => {
    it('should clear the groups collection', () => {
      const startState = createState(groups, true, 'something went wrong');
      const action = new GroupActions.ClearGroups();
      const result = reducer(startState, action);
      expect(result).toEqual(createState([], true, 'something went wrong'));
    });
  });
});
