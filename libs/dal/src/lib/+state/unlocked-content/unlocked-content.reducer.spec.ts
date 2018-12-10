import { Update } from '@ngrx/entity';
import { UnlockedContentActions } from '.';
import { UnlockedContentInterface } from '../../+models';
import { initialState, reducer, State } from './unlocked-content.reducer';

const indexInitialValue = 1;
const indexUpdatedValue = 100;

/**
 * Creates a UnlockedContent.
 * @param {number} id
 * @returns {UnlockedContentInterface}
 */
function createUnlockedContent(
  id: number,
  index: any = indexInitialValue
): UnlockedContentInterface | any {
  return {
    id: id,
    index: index
  };
}

/**
 * Utility to create the unlocked-content state.
 *
 * @param {UnlockedContentInterface[]} unlockedContents
 * @param {boolean} [loaded]
 * @param {*} [error]
 * @returns {State}
 */
function createState(
  unlockedContents: UnlockedContentInterface[],
  loaded: boolean = false,
  error?: any
): State {
  const state: any = {
    ids: unlockedContents
      ? unlockedContents.map(unlockedContent => unlockedContent.id)
      : [],
    entities: unlockedContents
      ? unlockedContents.reduce(
          (entityMap, unlockedContent) => ({
            ...entityMap,
            [unlockedContent.id]: unlockedContent
          }),
          {}
        )
      : {},
    loaded: loaded
  };
  if (error !== undefined) state.error = error;
  return state;
}

describe('UnlockedContents Reducer', () => {
  let unlockedContents: UnlockedContentInterface[];
  beforeEach(() => {
    unlockedContents = [
      createUnlockedContent(1),
      createUnlockedContent(2),
      createUnlockedContent(3)
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
    it('should load all unlockedContents', () => {
      const action = new UnlockedContentActions.UnlockedContentsLoaded({
        unlockedContents
      });
      const result = reducer(initialState, action);
      expect(result).toEqual(createState(unlockedContents, true));
    });

    it('should error', () => {
      const error = 'Something went wrong';
      const action = new UnlockedContentActions.UnlockedContentsLoadError(
        error
      );
      const result = reducer(initialState, action);
      expect(result).toEqual(createState([], false, error));
    });
  });

  describe('add actions', () => {
    it('should add one unlockedContent', () => {
      const unlockedContent = unlockedContents[0];
      const action = new UnlockedContentActions.AddUnlockedContent({
        unlockedContent
      });

      const result = reducer(initialState, action);
      expect(result).toEqual(createState([unlockedContent], false));
    });

    it('should add multiple unlockedContents', () => {
      const action = new UnlockedContentActions.AddUnlockedContents({
        unlockedContents
      });
      const result = reducer(initialState, action);

      expect(result).toEqual(createState(unlockedContents, false));
    });
  });
  describe('upsert actions', () => {
    it('should upsert one unlockedContent', () => {
      const originalUnlockedContent = unlockedContents[0];

      const startState = reducer(
        initialState,
        new UnlockedContentActions.AddUnlockedContent({
          unlockedContent: originalUnlockedContent
        })
      );

      const updatedUnlockedContent = createUnlockedContent(
        unlockedContents[0].id,
        'test'
      );

      const action = new UnlockedContentActions.UpsertUnlockedContent({
        unlockedContent: updatedUnlockedContent
      });

      const result = reducer(startState, action);

      expect(result.entities[updatedUnlockedContent.id]).toEqual(
        updatedUnlockedContent
      );
    });

    it('should upsert many unlockedContents', () => {
      const startState = createState(unlockedContents);

      const unlockedContentsToInsert = [
        createUnlockedContent(1),
        createUnlockedContent(2),
        createUnlockedContent(3),
        createUnlockedContent(4)
      ];
      const action = new UnlockedContentActions.UpsertUnlockedContents({
        unlockedContents: unlockedContentsToInsert
      });

      const result = reducer(startState, action);

      expect(result).toEqual(createState(unlockedContentsToInsert));
    });
  });

  describe('update actions', () => {
    it('should update an unlockedContent', () => {
      const unlockedContent = unlockedContents[0];
      const startState = createState([unlockedContent]);
      const update: Update<UnlockedContentInterface> = {
        id: 1,
        changes: {
          index: indexUpdatedValue
        }
      };
      const action = new UnlockedContentActions.UpdateUnlockedContent({
        unlockedContent: update
      });
      const result = reducer(startState, action);
      expect(result).toEqual(
        createState([createUnlockedContent(1, indexUpdatedValue)])
      );
    });

    it('should update multiple unlockedContents', () => {
      const startState = createState(unlockedContents);
      const updates: Update<UnlockedContentInterface>[] = [
        {
          id: 1,
          changes: {
            index: indexUpdatedValue
          }
        },
        {
          id: 2,
          changes: {
            index: indexUpdatedValue
          }
        }
      ];
      const action = new UnlockedContentActions.UpdateUnlockedContents({
        unlockedContents: updates
      });
      const result = reducer(startState, action);

      expect(result).toEqual(
        createState([
          createUnlockedContent(1, indexUpdatedValue),
          createUnlockedContent(2, indexUpdatedValue),
          unlockedContents[2]
        ])
      );
    });
  });

  describe('delete actions', () => {
    it('should delete one unlockedContent ', () => {
      const unlockedContent = unlockedContents[0];
      const startState = createState([unlockedContent]);
      const action = new UnlockedContentActions.DeleteUnlockedContent({
        id: unlockedContent.id
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([]));
    });

    it('should delete multiple unlockedContents', () => {
      const startState = createState(unlockedContents);
      const action = new UnlockedContentActions.DeleteUnlockedContents({
        ids: [unlockedContents[0].id, unlockedContents[1].id]
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([unlockedContents[2]]));
    });
  });

  describe('clear action', () => {
    it('should clear the unlockedContents collection', () => {
      const startState = createState(
        unlockedContents,
        true,
        'something went wrong'
      );
      const action = new UnlockedContentActions.ClearUnlockedContents();
      const result = reducer(startState, action);
      expect(result).toEqual(createState([], true, 'something went wrong'));
    });
  });
});
