import { Update } from '@ngrx/entity';
import { DiaboloPhaseActions } from '.';
import { DiaboloPhaseInterface } from '../../+models';
import { initialState, reducer, State } from './diabolo-phase.reducer';

/**
 * Creates a DiaboloPhase.
 * @param {number} id
 * @returns {DiaboloPhaseInterface}
 */
function createDiaboloPhase(
  id: number,
  name: string = 'intro'
): DiaboloPhaseInterface | any {
  return {
    id: id,
    name
  };
}

/**
 * Utility to create the diabolo-phase state.
 *
 * @param {DiaboloPhaseInterface[]} diaboloPhases
 * @param {boolean} [loaded]
 * @param {*} [error]
 * @returns {State}
 */
function createState(
  diaboloPhases: DiaboloPhaseInterface[],
  loaded: boolean = false,
  error?: any
): State {
  const state: any = {
    ids: diaboloPhases
      ? diaboloPhases.map(diaboloPhase => diaboloPhase.id)
      : [],
    entities: diaboloPhases
      ? diaboloPhases.reduce(
          (entityMap, diaboloPhase) => ({
            ...entityMap,
            [diaboloPhase.id]: diaboloPhase
          }),
          {}
        )
      : {},
    loaded: loaded
  };
  if (error !== undefined) state.error = error;
  return state;
}

describe('DiaboloPhases Reducer', () => {
  let diaboloPhases: DiaboloPhaseInterface[];
  beforeEach(() => {
    diaboloPhases = [
      createDiaboloPhase(1),
      createDiaboloPhase(2),
      createDiaboloPhase(3)
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
    it('should load all diaboloPhases', () => {
      const action = new DiaboloPhaseActions.DiaboloPhasesLoaded({
        diaboloPhases
      });
      const result = reducer(initialState, action);
      expect(result).toEqual(createState(diaboloPhases, true));
    });

    it('should error', () => {
      const error = 'Something went wrong';
      const action = new DiaboloPhaseActions.DiaboloPhasesLoadError(error);
      const result = reducer(initialState, action);
      expect(result).toEqual(createState([], false, error));
    });
  });

  describe('add actions', () => {
    it('should add one diaboloPhase', () => {
      const diaboloPhase = diaboloPhases[0];
      const action = new DiaboloPhaseActions.AddDiaboloPhase({
        diaboloPhase
      });

      const result = reducer(initialState, action);
      expect(result).toEqual(createState([diaboloPhase], false));
    });

    it('should add multiple diaboloPhases', () => {
      const action = new DiaboloPhaseActions.AddDiaboloPhases({
        diaboloPhases
      });
      const result = reducer(initialState, action);

      expect(result).toEqual(createState(diaboloPhases, false));
    });
  });
  describe('upsert actions', () => {
    it('should upsert one diaboloPhase', () => {
      const originalDiaboloPhase = diaboloPhases[0];

      const startState = reducer(
        initialState,
        new DiaboloPhaseActions.AddDiaboloPhase({
          diaboloPhase: originalDiaboloPhase
        })
      );

      const updatedDiaboloPhase = createDiaboloPhase(
        diaboloPhases[0].id,
        'test'
      );

      const action = new DiaboloPhaseActions.UpsertDiaboloPhase({
        diaboloPhase: updatedDiaboloPhase
      });

      const result = reducer(startState, action);

      expect(result.entities[updatedDiaboloPhase.id]).toEqual(
        updatedDiaboloPhase
      );
    });

    it('should upsert many diaboloPhases', () => {
      const startState = createState(diaboloPhases);

      const diaboloPhasesToInsert = [
        createDiaboloPhase(1),
        createDiaboloPhase(2),
        createDiaboloPhase(3),
        createDiaboloPhase(4)
      ];
      const action = new DiaboloPhaseActions.UpsertDiaboloPhases({
        diaboloPhases: diaboloPhasesToInsert
      });

      const result = reducer(startState, action);

      expect(result).toEqual(createState(diaboloPhasesToInsert));
    });
  });

  describe('update actions', () => {
    it('should update an diaboloPhase', () => {
      const diaboloPhase = diaboloPhases[0];
      const startState = createState([diaboloPhase]);
      const update: Update<DiaboloPhaseInterface> = {
        id: 1,
        changes: {
          name: 'outro'
        }
      };
      const action = new DiaboloPhaseActions.UpdateDiaboloPhase({
        diaboloPhase: update
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([createDiaboloPhase(1, 'outro')]));
    });

    it('should update multiple diaboloPhases', () => {
      const startState = createState(diaboloPhases);
      const updates: Update<DiaboloPhaseInterface>[] = [
        {
          id: 1,
          changes: {
            name: 'outro'
          }
        },
        {
          id: 2,
          changes: {
            name: 'outro'
          }
        }
      ];
      const action = new DiaboloPhaseActions.UpdateDiaboloPhases({
        diaboloPhases: updates
      });
      const result = reducer(startState, action);

      expect(result).toEqual(
        createState([
          createDiaboloPhase(1, 'outro'),
          createDiaboloPhase(2, 'outro'),
          diaboloPhases[2]
        ])
      );
    });
  });

  describe('delete actions', () => {
    it('should delete one diaboloPhase ', () => {
      const diaboloPhase = diaboloPhases[0];
      const startState = createState([diaboloPhase]);
      const action = new DiaboloPhaseActions.DeleteDiaboloPhase({
        id: diaboloPhase.id
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([]));
    });

    it('should delete multiple diaboloPhases', () => {
      const startState = createState(diaboloPhases);
      const action = new DiaboloPhaseActions.DeleteDiaboloPhases({
        ids: [diaboloPhases[0].id, diaboloPhases[1].id]
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([diaboloPhases[2]]));
    });
  });

  describe('clear action', () => {
    it('should clear the diaboloPhases collection', () => {
      const startState = createState(
        diaboloPhases,
        true,
        'something went wrong'
      );
      const action = new DiaboloPhaseActions.ClearDiaboloPhases();
      const result = reducer(startState, action);
      expect(result).toEqual(createState([], true, 'something went wrong'));
    });
  });
});
