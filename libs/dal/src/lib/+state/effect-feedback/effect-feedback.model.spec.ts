import { Action } from '@ngrx/store';
import { EffectFeedback } from './effect-feedback.model';

describe('EffectFeedback model', () => {
  describe('generateErrorFeedback', () => {
    it('should display feedback if useCustomErrorHandler = false', () => {
      const action = ({
        payload: { useCustomErrorHandler: false }
      } as unknown) as Action;

      const result = EffectFeedback.generateErrorFeedback(
        'foo',
        action,
        'foo message'
      );
      expect(result.display).toEqual(true);
    });

    it('should display feedback if the action does not have a useCustomErrorHandler flag', () => {
      const action = ({
        payload: {}
      } as unknown) as Action;

      const result = EffectFeedback.generateErrorFeedback(
        'foo',
        action,
        'foo message'
      );
      expect(result.display).toEqual(true);
    });

    it('should display feedback if the action does not have a payload', () => {
      const action = ({} as unknown) as Action;

      const result = EffectFeedback.generateErrorFeedback(
        'foo',
        action,
        'foo message'
      );
      expect(result.display).toBe(true);
    });

    it('should not display feedback if useCustomErrorHandler = true', () => {
      const action = ({
        payload: { useCustomErrorHandler: true }
      } as unknown) as Action;

      const result = EffectFeedback.generateErrorFeedback(
        'foo',
        action,
        'foo message'
      );
      expect(result.display).toEqual(false);
    });
  });
});
