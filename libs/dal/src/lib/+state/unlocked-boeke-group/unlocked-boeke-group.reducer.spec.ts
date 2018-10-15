import { Update } from '@ngrx/entity';
import { UnlockedBoekeGroupActions } from '.';
import { UnlockedBoekeGroupInterface } from '../../+models';
import { initialState, reducer, State } from './unlocked-boeke-group.reducer';

const eduContentIdInitialValue = 12;
const eduContentIdUpdatedValue = 144;

/**
 * Creates a UnlockedBoekeGroup.
 * @param {number} id
 * @returns {UnlockedBoekeGroupInterface}
 */
function createUnlockedBoekeGroup(
  id: number,
  eduContentId: any = eduContentIdInitialValue
): UnlockedBoekeGroupInterface | any {
  return {
    id: id,
    eduContentId: eduContentId
  };
}

/**
 * Utility to create the unlocked-boeke-group state.
 *
 * @param {UnlockedBoekeGroupInterface[]} unlockedBoekeGroups
 * @param {boolean} [loaded]
 * @param {*} [error]
 * @returns {State}
 */
function createState(
  unlockedBoekeGroups: UnlockedBoekeGroupInterface[],
  loaded: boolean = false,
  error?: any
): State {
  const state: any = {
    ids: unlockedBoekeGroups
      ? unlockedBoekeGroups.map(unlockedBoekeGroup => unlockedBoekeGroup.id)
      : [],
    entities: unlockedBoekeGroups
      ? unlockedBoekeGroups.reduce(
          (entityMap, unlockedBoekeGroup) => ({
            ...entityMap,
            [unlockedBoekeGroup.id]: unlockedBoekeGroup
          }),
          {}
        )
      : {},
    loaded: loaded
  };
  if (error !== undefined) state.error = error;
  return state;
}

describe('UnlockedBoekeGroups Reducer', () => {
  let unlockedBoekeGroups: UnlockedBoekeGroupInterface[];
  beforeEach(() => {
    unlockedBoekeGroups = [
      createUnlockedBoekeGroup(1),
      createUnlockedBoekeGroup(2),
      createUnlockedBoekeGroup(3)
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
    it('should load all unlockedBoekeGroups', () => {
      const action = new UnlockedBoekeGroupActions.UnlockedBoekeGroupsLoaded({
        unlockedBoekeGroups
      });
      const result = reducer(initialState, action);
      expect(result).toEqual(createState(unlockedBoekeGroups, true));
    });

    it('should error', () => {
      const error = 'Something went wrong';
      const action = new UnlockedBoekeGroupActions.UnlockedBoekeGroupsLoadError(
        error
      );
      const result = reducer(initialState, action);
      expect(result).toEqual(createState([], false, error));
    });
  });

  describe('add actions', () => {
    it('should add one unlockedBoekeGroup', () => {
      const unlockedBoekeGroup = unlockedBoekeGroups[0];
      const action = new UnlockedBoekeGroupActions.AddUnlockedBoekeGroup({
        unlockedBoekeGroup
      });

      const result = reducer(initialState, action);
      expect(result).toEqual(createState([unlockedBoekeGroup], false));
    });

    it('should add multiple unlockedBoekeGroups', () => {
      const action = new UnlockedBoekeGroupActions.AddUnlockedBoekeGroups({
        unlockedBoekeGroups
      });
      const result = reducer(initialState, action);

      expect(result).toEqual(createState(unlockedBoekeGroups, false));
    });
  });
  describe('upsert actions', () => {
    it('should upsert one unlockedBoekeGroup', () => {
      const originalUnlockedBoekeGroup = unlockedBoekeGroups[0];

      const startState = reducer(
        initialState,
        new UnlockedBoekeGroupActions.AddUnlockedBoekeGroup({
          unlockedBoekeGroup: originalUnlockedBoekeGroup
        })
      );

      const updatedUnlockedBoekeGroup = createUnlockedBoekeGroup(
        unlockedBoekeGroups[0].id,
        'test'
      );

      const action = new UnlockedBoekeGroupActions.UpsertUnlockedBoekeGroup({
        unlockedBoekeGroup: updatedUnlockedBoekeGroup
      });

      const result = reducer(startState, action);

      expect(result.entities[updatedUnlockedBoekeGroup.id]).toEqual(
        updatedUnlockedBoekeGroup
      );
    });

    it('should upsert many unlockedBoekeGroups', () => {
      const startState = createState(unlockedBoekeGroups);

      const unlockedBoekeGroupsToInsert = [
        createUnlockedBoekeGroup(1),
        createUnlockedBoekeGroup(2),
        createUnlockedBoekeGroup(3),
        createUnlockedBoekeGroup(4)
      ];
      const action = new UnlockedBoekeGroupActions.UpsertUnlockedBoekeGroups({
        unlockedBoekeGroups: unlockedBoekeGroupsToInsert
      });

      const result = reducer(startState, action);

      expect(result).toEqual(createState(unlockedBoekeGroupsToInsert));
    });
  });

  describe('update actions', () => {
    it('should update an unlockedBoekeGroup', () => {
      const unlockedBoekeGroup = unlockedBoekeGroups[0];
      const startState = createState([unlockedBoekeGroup]);
      const update: Update<UnlockedBoekeGroupInterface> = {
        id: 1,
        changes: {
          eduContentId: eduContentIdUpdatedValue
        }
      };
      const action = new UnlockedBoekeGroupActions.UpdateUnlockedBoekeGroup({
        unlockedBoekeGroup: update
      });
      const result = reducer(startState, action);
      expect(result).toEqual(
        createState([createUnlockedBoekeGroup(1, eduContentIdUpdatedValue)])
      );
    });

    it('should update multiple unlockedBoekeGroups', () => {
      const startState = createState(unlockedBoekeGroups);
      const updates: Update<UnlockedBoekeGroupInterface>[] = [
        {
          id: 1,
          changes: {
            eduContentId: eduContentIdUpdatedValue
          }
        },
        {
          id: 2,
          changes: {
            eduContentId: eduContentIdUpdatedValue
          }
        }
      ];
      const action = new UnlockedBoekeGroupActions.UpdateUnlockedBoekeGroups({
        unlockedBoekeGroups: updates
      });
      const result = reducer(startState, action);

      expect(result).toEqual(
        createState([
          createUnlockedBoekeGroup(1, eduContentIdUpdatedValue),
          createUnlockedBoekeGroup(2, eduContentIdUpdatedValue),
          unlockedBoekeGroups[2]
        ])
      );
    });
  });

  describe('delete actions', () => {
    it('should delete one unlockedBoekeGroup ', () => {
      const unlockedBoekeGroup = unlockedBoekeGroups[0];
      const startState = createState([unlockedBoekeGroup]);
      const action = new UnlockedBoekeGroupActions.DeleteUnlockedBoekeGroup({
        id: unlockedBoekeGroup.id
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([]));
    });

    it('should delete multiple unlockedBoekeGroups', () => {
      const startState = createState(unlockedBoekeGroups);
      const action = new UnlockedBoekeGroupActions.DeleteUnlockedBoekeGroups({
        ids: [unlockedBoekeGroups[0].id, unlockedBoekeGroups[1].id]
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([unlockedBoekeGroups[2]]));
    });
  });

  describe('clear action', () => {
    it('should clear the unlockedBoekeGroups collection', () => {
      const startState = createState(
        unlockedBoekeGroups,
        true,
        'something went wrong'
      );
      const action = new UnlockedBoekeGroupActions.ClearUnlockedBoekeGroups();
      const result = reducer(startState, action);
      expect(result).toEqual(createState([], true, 'something went wrong'));
    });
  });
});
