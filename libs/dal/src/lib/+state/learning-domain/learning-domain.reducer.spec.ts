import { Update } from '@ngrx/entity';
import { LearningDomainActions } from '.';
import { LearningDomainInterface } from '../../+models';
import { initialState, reducer, State } from './learning-domain.reducer';

const nameInitialValue = 'Metend lezen';
const nameUpdatedValue = 'Begrijpend luisteren';

/**
 * Creates a LearningDomain.
 * @param {number} id
 * @returns {LearningDomainInterface}
 */
function createLearningDomain(
  id: number,
  name: any = nameInitialValue
): LearningDomainInterface | any {
  return {
    id: id,
    name: name
  };
}

/**
 * Utility to create the learning-domain state.
 *
 * @param {LearningDomainInterface[]} learningDomains
 * @param {boolean} [loaded]
 * @param {*} [error]
 * @returns {State}
 */
function createState(
  learningDomains: LearningDomainInterface[],
  loaded: boolean = false,
  error?: any
): State {
  const state: any = {
    ids: learningDomains
      ? learningDomains.map(learningDomain => learningDomain.id)
      : [],
    entities: learningDomains
      ? learningDomains.reduce(
          (entityMap, learningDomain) => ({
            ...entityMap,
            [learningDomain.id]: learningDomain
          }),
          {}
        )
      : {},
    loaded: loaded
  };
  if (error !== undefined) state.error = error;
  return state;
}

describe('LearningDomains Reducer', () => {
  let learningDomains: LearningDomainInterface[];
  beforeEach(() => {
    learningDomains = [
      createLearningDomain(1),
      createLearningDomain(2),
      createLearningDomain(3)
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
    it('should load all learningDomains', () => {
      const action = new LearningDomainActions.LearningDomainsLoaded({
        learningDomains
      });
      const result = reducer(initialState, action);
      expect(result).toEqual(createState(learningDomains, true));
    });

    it('should error', () => {
      const error = 'Something went wrong';
      const action = new LearningDomainActions.LearningDomainsLoadError(error);
      const result = reducer(initialState, action);
      expect(result).toEqual(createState([], false, error));
    });
  });

  describe('add actions', () => {
    it('should add one learningDomain', () => {
      const learningDomain = learningDomains[0];
      const action = new LearningDomainActions.AddLearningDomain({
        learningDomain
      });

      const result = reducer(initialState, action);
      expect(result).toEqual(createState([learningDomain], false));
    });

    it('should add multiple learningDomains', () => {
      const action = new LearningDomainActions.AddLearningDomains({
        learningDomains
      });
      const result = reducer(initialState, action);

      expect(result).toEqual(createState(learningDomains, false));
    });
  });
  describe('upsert actions', () => {
    it('should upsert one learningDomain', () => {
      const originalLearningDomain = learningDomains[0];

      const startState = reducer(
        initialState,
        new LearningDomainActions.AddLearningDomain({
          learningDomain: originalLearningDomain
        })
      );

      const updatedLearningDomain = createLearningDomain(
        learningDomains[0].id,
        'test'
      );

      const action = new LearningDomainActions.UpsertLearningDomain({
        learningDomain: updatedLearningDomain
      });

      const result = reducer(startState, action);

      expect(result.entities[updatedLearningDomain.id]).toEqual(
        updatedLearningDomain
      );
    });

    it('should upsert many learningDomains', () => {
      const startState = createState(learningDomains);

      const learningDomainsToInsert = [
        createLearningDomain(1),
        createLearningDomain(2),
        createLearningDomain(3),
        createLearningDomain(4)
      ];
      const action = new LearningDomainActions.UpsertLearningDomains({
        learningDomains: learningDomainsToInsert
      });

      const result = reducer(startState, action);

      expect(result).toEqual(createState(learningDomainsToInsert));
    });
  });

  describe('update actions', () => {
    it('should update an learningDomain', () => {
      const learningDomain = learningDomains[0];
      const startState = createState([learningDomain]);
      const update: Update<LearningDomainInterface> = {
        id: 1,
        changes: {
          name: nameUpdatedValue
        }
      };
      const action = new LearningDomainActions.UpdateLearningDomain({
        learningDomain: update
      });
      const result = reducer(startState, action);
      expect(result).toEqual(
        createState([createLearningDomain(1, nameUpdatedValue)])
      );
    });

    it('should update multiple learningDomains', () => {
      const startState = createState(learningDomains);
      const updates: Update<LearningDomainInterface>[] = [
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
      const action = new LearningDomainActions.UpdateLearningDomains({
        learningDomains: updates
      });
      const result = reducer(startState, action);

      expect(result).toEqual(
        createState([
          createLearningDomain(1, nameUpdatedValue),
          createLearningDomain(2, nameUpdatedValue),
          learningDomains[2]
        ])
      );
    });
  });

  describe('delete actions', () => {
    it('should delete one learningDomain ', () => {
      const learningDomain = learningDomains[0];
      const startState = createState([learningDomain]);
      const action = new LearningDomainActions.DeleteLearningDomain({
        id: learningDomain.id
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([]));
    });

    it('should delete multiple learningDomains', () => {
      const startState = createState(learningDomains);
      const action = new LearningDomainActions.DeleteLearningDomains({
        ids: [learningDomains[0].id, learningDomains[1].id]
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([learningDomains[2]]));
    });
  });

  describe('clear action', () => {
    it('should clear the learningDomains collection', () => {
      const startState = createState(
        learningDomains,
        true,
        'something went wrong'
      );
      const action = new LearningDomainActions.ClearLearningDomains();
      const result = reducer(startState, action);
      expect(result).toEqual(createState([], true, 'something went wrong'));
    });
  });
});
