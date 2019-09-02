import { Update } from '@ngrx/entity';
import { UnlockedFreePracticeActions } from '.';
import { UnlockedFreePracticeInterface } from '../../+models';
import { initialState, reducer, State } from './unlocked-free-practice.reducer';

/**
 * This file is scaffolded, but needs some special attention:
 * - find and replace 'classGroupId' and replace this with a property name of the UnlockedFreePractice entity.
 * - set the initial property value via '[classGroupId]InitialValue'.
 * - set the updated property value via '[classGroupId]UpdatedValue'.
 */
const classGroupIdInitialValue = 1;
const classGroupIdUpdatedValue = 2;

/**
 * Creates a UnlockedFreePractice.
 * @param {number} id
 * @returns {UnlockedFreePracticeInterface}
 */
function createUnlockedFreePractice(
  id: number,
  classGroupId: any = classGroupIdInitialValue
): UnlockedFreePracticeInterface | any {
  return {
    id: id,
    classGroupId: classGroupId
  };
}

/**
 * Utility to create the unlocked-free-practice state.
 *
 * @param {UnlockedFreePracticeInterface[]} unlockedFreePractices
 * @param {boolean} [loaded]
 * @param {*} [error]
 * @returns {State}
 */
function createState(
  unlockedFreePractices: UnlockedFreePracticeInterface[],
  loaded: boolean = false,
  error?: any
): State {
  const state: any = {
    ids: unlockedFreePractices
      ? unlockedFreePractices.map(
          unlockedFreePractice => unlockedFreePractice.id
        )
      : [],
    entities: unlockedFreePractices
      ? unlockedFreePractices.reduce(
          (entityMap, unlockedFreePractice) => ({
            ...entityMap,
            [unlockedFreePractice.id]: unlockedFreePractice
          }),
          {}
        )
      : {},
    loaded: loaded
  };
  if (error !== undefined) state.error = error;
  return state;
}

describe('UnlockedFreePractices Reducer', () => {
  let unlockedFreePractices: UnlockedFreePracticeInterface[];
  beforeEach(() => {
    unlockedFreePractices = [
      createUnlockedFreePractice(1),
      createUnlockedFreePractice(2),
      createUnlockedFreePractice(3)
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
    it('should load all unlockedFreePractices', () => {
      const action = new UnlockedFreePracticeActions.UnlockedFreePracticesLoaded(
        { unlockedFreePractices }
      );
      const result = reducer(initialState, action);
      expect(result).toEqual(createState(unlockedFreePractices, true));
    });

    it('should error', () => {
      const error = 'Something went wrong';
      const action = new UnlockedFreePracticeActions.UnlockedFreePracticesLoadError(
        error
      );
      const result = reducer(initialState, action);
      expect(result).toEqual(createState([], false, error));
    });
  });

  describe('add actions', () => {
    it('should add one unlockedFreePractice', () => {
      const unlockedFreePractice = unlockedFreePractices[0];
      const action = new UnlockedFreePracticeActions.AddUnlockedFreePractice({
        unlockedFreePractice
      });

      const result = reducer(initialState, action);
      expect(result).toEqual(createState([unlockedFreePractice], false));
    });

    it('should add multiple unlockedFreePractices', () => {
      const action = new UnlockedFreePracticeActions.AddUnlockedFreePractices({
        unlockedFreePractices
      });
      const result = reducer(initialState, action);

      expect(result).toEqual(createState(unlockedFreePractices, false));
    });
  });
  describe('upsert actions', () => {
    it('should upsert one unlockedFreePractice', () => {
      const originalUnlockedFreePractice = unlockedFreePractices[0];

      const startState = reducer(
        initialState,
        new UnlockedFreePracticeActions.AddUnlockedFreePractice({
          unlockedFreePractice: originalUnlockedFreePractice
        })
      );

      const updatedUnlockedFreePractice = createUnlockedFreePractice(
        unlockedFreePractices[0].id,
        'test'
      );

      const action = new UnlockedFreePracticeActions.UpsertUnlockedFreePractice(
        {
          unlockedFreePractice: updatedUnlockedFreePractice
        }
      );

      const result = reducer(startState, action);

      expect(result.entities[updatedUnlockedFreePractice.id]).toEqual(
        updatedUnlockedFreePractice
      );
    });

    it('should upsert many unlockedFreePractices', () => {
      const startState = createState(unlockedFreePractices);

      const unlockedFreePracticesToInsert = [
        createUnlockedFreePractice(1),
        createUnlockedFreePractice(2),
        createUnlockedFreePractice(3),
        createUnlockedFreePractice(4)
      ];
      const action = new UnlockedFreePracticeActions.UpsertUnlockedFreePractices(
        {
          unlockedFreePractices: unlockedFreePracticesToInsert
        }
      );

      const result = reducer(startState, action);

      expect(result).toEqual(createState(unlockedFreePracticesToInsert));
    });
  });

  describe('update actions', () => {
    it('should update an unlockedFreePractice', () => {
      const unlockedFreePractice = unlockedFreePractices[0];
      const startState = createState([unlockedFreePractice]);
      const update: Update<UnlockedFreePracticeInterface> = {
        id: 1,
        changes: {
          classGroupId: classGroupIdUpdatedValue
        }
      };
      const action = new UnlockedFreePracticeActions.UpdateUnlockedFreePractice(
        {
          unlockedFreePractice: update
        }
      );
      const result = reducer(startState, action);
      expect(result).toEqual(
        createState([createUnlockedFreePractice(1, classGroupIdUpdatedValue)])
      );
    });

    it('should update multiple unlockedFreePractices', () => {
      const startState = createState(unlockedFreePractices);
      const updates: Update<UnlockedFreePracticeInterface>[] = [
        {
          id: 1,
          changes: {
            classGroupId: classGroupIdUpdatedValue
          }
        },
        {
          id: 2,
          changes: {
            classGroupId: classGroupIdUpdatedValue
          }
        }
      ];
      const action = new UnlockedFreePracticeActions.UpdateUnlockedFreePractices(
        {
          unlockedFreePractices: updates
        }
      );
      const result = reducer(startState, action);

      expect(result).toEqual(
        createState([
          createUnlockedFreePractice(1, classGroupIdUpdatedValue),
          createUnlockedFreePractice(2, classGroupIdUpdatedValue),
          unlockedFreePractices[2]
        ])
      );
    });
  });

  describe('delete actions', () => {
    it('should delete one unlockedFreePractice ', () => {
      const unlockedFreePractice = unlockedFreePractices[0];
      const startState = createState([unlockedFreePractice]);
      const action = new UnlockedFreePracticeActions.DeleteUnlockedFreePractice(
        {
          id: unlockedFreePractice.id
        }
      );
      const result = reducer(startState, action);
      expect(result).toEqual(createState([]));
    });

    it('should delete multiple unlockedFreePractices', () => {
      const startState = createState(unlockedFreePractices);
      const action = new UnlockedFreePracticeActions.DeleteUnlockedFreePractices(
        {
          ids: [unlockedFreePractices[0].id, unlockedFreePractices[1].id]
        }
      );
      const result = reducer(startState, action);
      expect(result).toEqual(createState([unlockedFreePractices[2]]));
    });
  });

  describe('clear action', () => {
    it('should clear the unlockedFreePractices collection', () => {
      const startState = createState(
        unlockedFreePractices,
        true,
        'something went wrong'
      );
      const action = new UnlockedFreePracticeActions.ClearUnlockedFreePractices();
      const result = reducer(startState, action);
      expect(result).toEqual(createState([], true, 'something went wrong'));
    });
  });
});
