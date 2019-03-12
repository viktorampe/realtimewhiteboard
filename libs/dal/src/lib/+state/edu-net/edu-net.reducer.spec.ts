import { Update } from '@ngrx/entity';
import { EduNetActions } from '.';
import { EduNetInterface } from '../../+models';
import { initialState, reducer, State } from './edu-net.reducer';

/**
 * This file is scaffolded, but needs some special attention:
 * - find and replace 'name' and replace this with a property name of the EduNet entity.
 * - set the initial property value via '[name]InitialValue'.
 * - set the updated property value via '[name]UpdatedValue'.
 */
const nameInitialValue = 'foo';
const nameUpdatedValue = 'bar';

/**
 * Creates a EduNet.
 * @param {number} id
 * @returns {EduNetInterface}
 */
function createEduNet(
  id: number,
  name: any = nameInitialValue
): EduNetInterface | any {
  return {
    id: id,
    name: name
  };
}

/**
 * Utility to create the edu-net state.
 *
 * @param {EduNetInterface[]} eduNets
 * @param {boolean} [loaded]
 * @param {*} [error]
 * @returns {State}
 */
function createState(
  eduNets: EduNetInterface[],
  loaded: boolean = false,
  error?: any
): State {
  const state: any = {
    ids: eduNets ? eduNets.map(eduNet => eduNet.id) : [],
    entities: eduNets
      ? eduNets.reduce(
          (entityMap, eduNet) => ({
            ...entityMap,
            [eduNet.id]: eduNet
          }),
          {}
        )
      : {},
    loaded: loaded
  };
  if (error !== undefined) state.error = error;
  return state;
}

describe('EduNets Reducer', () => {
  let eduNets: EduNetInterface[];
  beforeEach(() => {
    eduNets = [createEduNet(1), createEduNet(2), createEduNet(3)];
  });

  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });

  describe('loaded action', () => {
    it('should load all eduNets', () => {
      const action = new EduNetActions.EduNetsLoaded({ eduNets });
      const result = reducer(initialState, action);
      expect(result).toEqual(createState(eduNets, true));
    });

    it('should error', () => {
      const error = 'Something went wrong';
      const action = new EduNetActions.EduNetsLoadError(error);
      const result = reducer(initialState, action);
      expect(result).toEqual(createState([], false, error));
    });
  });

  describe('add actions', () => {
    it('should add one eduNet', () => {
      const eduNet = eduNets[0];
      const action = new EduNetActions.AddEduNet({
        eduNet
      });

      const result = reducer(initialState, action);
      expect(result).toEqual(createState([eduNet], false));
    });

    it('should add multiple eduNets', () => {
      const action = new EduNetActions.AddEduNets({ eduNets });
      const result = reducer(initialState, action);

      expect(result).toEqual(createState(eduNets, false));
    });
  });
  describe('upsert actions', () => {
    it('should upsert one eduNet', () => {
      const originalEduNet = eduNets[0];

      const startState = reducer(
        initialState,
        new EduNetActions.AddEduNet({
          eduNet: originalEduNet
        })
      );

      const updatedEduNet = createEduNet(eduNets[0].id, 'test');

      const action = new EduNetActions.UpsertEduNet({
        eduNet: updatedEduNet
      });

      const result = reducer(startState, action);

      expect(result.entities[updatedEduNet.id]).toEqual(updatedEduNet);
    });

    it('should upsert many eduNets', () => {
      const startState = createState(eduNets);

      const eduNetsToInsert = [
        createEduNet(1),
        createEduNet(2),
        createEduNet(3),
        createEduNet(4)
      ];
      const action = new EduNetActions.UpsertEduNets({
        eduNets: eduNetsToInsert
      });

      const result = reducer(startState, action);

      expect(result).toEqual(createState(eduNetsToInsert));
    });
  });

  describe('update actions', () => {
    it('should update an eduNet', () => {
      const eduNet = eduNets[0];
      const startState = createState([eduNet]);
      const update: Update<EduNetInterface> = {
        id: 1,
        changes: {
          name: nameUpdatedValue
        }
      };
      const action = new EduNetActions.UpdateEduNet({
        eduNet: update
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([createEduNet(1, nameUpdatedValue)]));
    });

    it('should update multiple eduNets', () => {
      const startState = createState(eduNets);
      const updates: Update<EduNetInterface>[] = [
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
      const action = new EduNetActions.UpdateEduNets({
        eduNets: updates
      });
      const result = reducer(startState, action);

      expect(result).toEqual(
        createState([
          createEduNet(1, nameUpdatedValue),
          createEduNet(2, nameUpdatedValue),
          eduNets[2]
        ])
      );
    });
  });

  describe('delete actions', () => {
    it('should delete one eduNet ', () => {
      const eduNet = eduNets[0];
      const startState = createState([eduNet]);
      const action = new EduNetActions.DeleteEduNet({
        id: eduNet.id
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([]));
    });

    it('should delete multiple eduNets', () => {
      const startState = createState(eduNets);
      const action = new EduNetActions.DeleteEduNets({
        ids: [eduNets[0].id, eduNets[1].id]
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([eduNets[2]]));
    });
  });

  describe('clear action', () => {
    it('should clear the eduNets collection', () => {
      const startState = createState(eduNets, true, 'something went wrong');
      const action = new EduNetActions.ClearEduNets();
      const result = reducer(startState, action);
      expect(result).toEqual(createState([], true, 'something went wrong'));
    });
  });
});
