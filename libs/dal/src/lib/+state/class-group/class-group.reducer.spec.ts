import { Update } from '@ngrx/entity';
import { ClassGroupActions } from '.';
import { ClassGroupInterface } from '../../+models';
import { initialState, reducer, State } from './class-group.reducer';

/**
 * This file is scaffolded, but needs some special attention:
 * - find and replace 'name' and replace this with a property name of the ClassGroup entity.
 * - set the initial property value via '[name]InitialValue'.
 * - set the updated property value via '[name]UpdatedValue'.
 */
const nameInitialValue = 'K1';
const nameUpdatedValue = 'L1';

/**
 * Creates a ClassGroup.
 * @param {number} id
 * @returns {ClassGroupInterface}
 */
function createClassGroup(
  id: number,
  name: any = nameInitialValue
): ClassGroupInterface | any {
  return {
    id: id,
    name: name
  };
}

/**
 * Utility to create the class-group state.
 *
 * @param {ClassGroupInterface[]} classGroups
 * @param {boolean} [loaded]
 * @param {*} [error]
 * @returns {State}
 */
function createState(
  classGroups: ClassGroupInterface[],
  loaded: boolean = false,
  error?: any
): State {
  const state: any = {
    ids: classGroups ? classGroups.map(classGroup => classGroup.id) : [],
    entities: classGroups
      ? classGroups.reduce(
          (entityMap, classGroup) => ({
            ...entityMap,
            [classGroup.id]: classGroup
          }),
          {}
        )
      : {},
    loaded: loaded
  };
  if (error !== undefined) state.error = error;
  return state;
}

describe('ClassGroups Reducer', () => {
  let classGroups: ClassGroupInterface[];
  beforeEach(() => {
    classGroups = [
      createClassGroup(1),
      createClassGroup(2),
      createClassGroup(3)
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
    it('should load all classGroups', () => {
      const action = new ClassGroupActions.ClassGroupsLoaded({ classGroups });
      const result = reducer(initialState, action);
      expect(result).toEqual(createState(classGroups, true));
    });

    it('should error', () => {
      const error = 'Something went wrong';
      const action = new ClassGroupActions.ClassGroupsLoadError(error);
      const result = reducer(initialState, action);
      expect(result).toEqual(createState([], false, error));
    });
  });

  describe('add actions', () => {
    it('should add one classGroup', () => {
      const classGroup = classGroups[0];
      const action = new ClassGroupActions.AddClassGroup({
        classGroup
      });

      const result = reducer(initialState, action);
      expect(result).toEqual(createState([classGroup], false));
    });

    it('should add multiple classGroups', () => {
      const action = new ClassGroupActions.AddClassGroups({ classGroups });
      const result = reducer(initialState, action);

      expect(result).toEqual(createState(classGroups, false));
    });
  });
  describe('upsert actions', () => {
    it('should upsert one classGroup', () => {
      const originalClassGroup = classGroups[0];

      const startState = reducer(
        initialState,
        new ClassGroupActions.AddClassGroup({
          classGroup: originalClassGroup
        })
      );

      const updatedClassGroup = createClassGroup(classGroups[0].id, 'test');

      const action = new ClassGroupActions.UpsertClassGroup({
        classGroup: updatedClassGroup
      });

      const result = reducer(startState, action);

      expect(result.entities[updatedClassGroup.id]).toEqual(updatedClassGroup);
    });

    it('should upsert many classGroups', () => {
      const startState = createState(classGroups);

      const classGroupsToInsert = [
        createClassGroup(1),
        createClassGroup(2),
        createClassGroup(3),
        createClassGroup(4)
      ];
      const action = new ClassGroupActions.UpsertClassGroups({
        classGroups: classGroupsToInsert
      });

      const result = reducer(startState, action);

      expect(result).toEqual(createState(classGroupsToInsert));
    });
  });

  describe('update actions', () => {
    it('should update an classGroup', () => {
      const classGroup = classGroups[0];
      const startState = createState([classGroup]);
      const update: Update<ClassGroupInterface> = {
        id: 1,
        changes: {
          name: nameUpdatedValue
        }
      };
      const action = new ClassGroupActions.UpdateClassGroup({
        classGroup: update
      });
      const result = reducer(startState, action);
      expect(result).toEqual(
        createState([createClassGroup(1, nameUpdatedValue)])
      );
    });

    it('should update multiple classGroups', () => {
      const startState = createState(classGroups);
      const updates: Update<ClassGroupInterface>[] = [
        {
          id: 1,
          changes: {
            name: nameUpdatedValue
          }
        },
        {
          id: 2,
          changes: {
            name: nameUpdatedValue
          }
        }
      ];
      const action = new ClassGroupActions.UpdateClassGroups({
        classGroups: updates
      });
      const result = reducer(startState, action);

      expect(result).toEqual(
        createState([
          createClassGroup(1, nameUpdatedValue),
          createClassGroup(2, nameUpdatedValue),
          classGroups[2]
        ])
      );
    });
  });

  describe('delete actions', () => {
    it('should delete one classGroup ', () => {
      const classGroup = classGroups[0];
      const startState = createState([classGroup]);
      const action = new ClassGroupActions.DeleteClassGroup({
        id: classGroup.id
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([]));
    });

    it('should delete multiple classGroups', () => {
      const startState = createState(classGroups);
      const action = new ClassGroupActions.DeleteClassGroups({
        ids: [classGroups[0].id, classGroups[1].id]
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([classGroups[2]]));
    });
  });

  describe('clear action', () => {
    it('should clear the classGroups collection', () => {
      const startState = createState(classGroups, true, 'something went wrong');
      const action = new ClassGroupActions.ClearClassGroups();
      const result = reducer(startState, action);
      expect(result).toEqual(createState([], true, 'something went wrong'));
    });
  });
});
