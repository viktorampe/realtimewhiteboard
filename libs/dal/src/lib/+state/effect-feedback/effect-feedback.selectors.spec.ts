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
  beforeEach(() => {
    effectFeedbackState = createEffectFeedbackState([
      new EffectFeedbackFixture({ id: 'guid6', display: false }),
      new EffectFeedbackFixture({ id: 'guid8', display: true }),
      new EffectFeedbackFixture({ id: 'guid10', display: false }),
      new EffectFeedbackFixture({ id: 'guid11', display: true })
    ]);
    storeState = { effectFeedback: effectFeedbackState };
  });

  it('getNext() should return the first effect feedback with display = true', () => {
    const results = EffectFeedbackQueries.getNext(storeState);
    expect(results).toBe(effectFeedbackState.entities['guid8']);
  });
});
