import { EffectFeedbackQueries } from '.';
import { EffectFeedbackFixture } from '../../+fixtures/EffectFeedback.fixture';
import { EffectFeedbackInterface } from './effect-feedback.model';
import { State } from './effect-feedback.reducer';

/**
 * Utility to create the task-edu-content state.
 *
 * @param {TaskEduContentInterface[]} effectFeedback
 * @param {boolean} [loaded]
 * @param {*} [error]
 * @returns {State}
 */
function createEffectFeedbackState(
  effectFeedback: EffectFeedbackInterface[],
  error?: any
): State {
  const state: any = {
    ids: effectFeedback ? effectFeedback.map(feedback => feedback.id) : [],
    entities: effectFeedback
      ? effectFeedback.reduce(
          (entityMap, feedback) => ({
            ...entityMap,
            [feedback.id]: feedback
          }),
          {}
        )
      : {}
  };
  if (error !== undefined) state.error = error;
  return state;
}

let effectFeedbackState: State;
let storeState: any;

describe('EffectFeedback selectors', () => {
  it('getNext() should return the first effect feedback with display = true', () => {
    effectFeedbackState = createEffectFeedbackState([
      new EffectFeedbackFixture({ id: 'guid6', display: false, type: 'error' }),
      new EffectFeedbackFixture({ id: 'guid8', display: true, type: 'error' }),
      new EffectFeedbackFixture({
        id: 'guid10',
        display: false,
        type: 'success'
      }),
      new EffectFeedbackFixture({
        id: 'guid6',
        display: false,
        triggerAction: { type: 'foo' }
      }),
      new EffectFeedbackFixture({
        id: 'guid8',
        display: true
      }),
      new EffectFeedbackFixture({ id: 'guid10', display: false }),
      new EffectFeedbackFixture({ id: 'guid11', display: true }),
      new EffectFeedbackFixture({
        id: 'guid12',
        display: false,
        triggerAction: { type: 'bar' }
      })
    ]);
    storeState = { effectFeedback: effectFeedbackState };

    const result = EffectFeedbackQueries.getNext(storeState);
    expect(result).toBe(effectFeedbackState.entities['guid8']);
  });

  it('getNextError() should return getNext() with type ==== error', () => {
    effectFeedbackState = createEffectFeedbackState([
      new EffectFeedbackFixture({ id: 'guid8', display: true, type: 'error' })
    ]);
    storeState = { effectFeedback: effectFeedbackState };

    let result = EffectFeedbackQueries.getNextError(storeState);
    expect(result).toBe(effectFeedbackState.entities['guid8']);

    // if the getNext() isn't an error
    effectFeedbackState = createEffectFeedbackState([
      new EffectFeedbackFixture({ id: 'guid8', display: true, type: 'success' })
    ]);
    storeState = { effectFeedback: effectFeedbackState };

    result = EffectFeedbackQueries.getNextError(storeState);
    expect(result).toBeFalsy();
  });

  it('getNextSuccess() should return getNext() with type ==== success', () => {
    effectFeedbackState = createEffectFeedbackState([
      new EffectFeedbackFixture({ id: 'guid8', display: true, type: 'success' })
    ]);
    storeState = { effectFeedback: effectFeedbackState };

    let result = EffectFeedbackQueries.getNextSuccess(storeState);
    expect(result).toBe(effectFeedbackState.entities['guid8']);

    // if the getNext() isn't an success
    effectFeedbackState = createEffectFeedbackState([
      new EffectFeedbackFixture({ id: 'guid8', display: true, type: 'error' })
    ]);
    storeState = { effectFeedback: effectFeedbackState };

    result = EffectFeedbackQueries.getNextSuccess(storeState);
    expect(result).toBeFalsy();
  });

  it('getFeedbackForAction() should return the first effect feedback with the specified trigger action', () => {
    effectFeedbackState = createEffectFeedbackState([
      new EffectFeedbackFixture({
        id: 'guid11',
        display: false,
        triggerAction: { type: 'foo' }
      }),
      new EffectFeedbackFixture({
        id: 'guid12',
        display: false,
        triggerAction: { type: 'bar' }
      })
    ]);
    storeState = { effectFeedback: effectFeedbackState };

    const results = EffectFeedbackQueries.getFeedbackForAction(storeState, {
      actionType: 'bar'
    });
    expect(results).toBeDefined();
    expect(results).toBe(effectFeedbackState.entities['guid12']);
  });

  it(
    'getNextErrorFeedbackForAction() should return the first effect feedback' +
      ' with the specified trigger action' +
      ' and type error',
    () => {
      effectFeedbackState = createEffectFeedbackState([
        new EffectFeedbackFixture({
          // error, wrong action type
          id: 'guid11',
          display: false,
          triggerAction: { type: 'foo' },
          type: 'error'
        }),
        new EffectFeedbackFixture({
          // success, correct action type
          id: 'guid12',
          display: false,
          triggerAction: { type: 'bar' },
          type: 'success'
        }),
        new EffectFeedbackFixture({
          // error, correct action type -> this should be the result
          id: 'guid13',
          display: false,
          triggerAction: { type: 'bar' },
          type: 'error'
        })
      ]);
      storeState = { effectFeedback: effectFeedbackState };

      const results = EffectFeedbackQueries.getNextErrorFeedbackForAction(
        storeState,
        {
          actionType: 'bar'
        }
      );
      expect(results).toBeDefined();
      expect(results).toBe(effectFeedbackState.entities['guid13']);
    }
  );
});
