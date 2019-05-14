import {
  EffectFeedback,
  FeedbackTriggeringAction,
  FeedbackTriggeringPayload
} from './effect-feedback.model';

describe('EffectFeedback model', () => {
  describe('generateErrorFeedback', () => {
    it('should display error feedback depending on action.payload.customFeedbackHandlers.useCustomErrorHandler data', () => {
      const assertionData: {
        action: { payload: FeedbackTriggeringPayload };
        expectedDisplay: boolean;
      }[] = [
        {
          action: null,
          expectedDisplay: true
        },
        {
          action: { payload: null },
          expectedDisplay: true
        },
        {
          action: { payload: {} },
          expectedDisplay: true
        },
        {
          action: { payload: { customFeedbackHandlers: null } },
          expectedDisplay: true
        },
        {
          action: {
            payload: {
              customFeedbackHandlers: { useCustomErrorHandler: null }
            }
          },
          expectedDisplay: true
        },
        {
          action: {
            payload: {
              customFeedbackHandlers: { useCustomErrorHandler: false }
            }
          },
          expectedDisplay: true
        },
        {
          action: {
            payload: {
              customFeedbackHandlers: { useCustomErrorHandler: true }
            }
          },
          expectedDisplay: false
        }
      ];
      assertionData.forEach(data => {
        const action = (data.action as unknown) as FeedbackTriggeringAction;

        const result = EffectFeedback.generateErrorFeedback(
          'foo',
          action,
          'foo message'
        );
        expect(result.display).toEqual(data.expectedDisplay);
      });
    });

    it('should display success feedback depending on action.payload.customFeedbackHandlers.useCustomSuccessHandler data', () => {
      const assertionData: {
        action: { payload: FeedbackTriggeringPayload };
        expectedDisplay: boolean;
      }[] = [
        {
          action: null,
          expectedDisplay: true
        },
        {
          action: { payload: null },
          expectedDisplay: true
        },
        {
          action: { payload: {} },
          expectedDisplay: true
        },
        {
          action: {
            payload: { customFeedbackHandlers: null }
          },
          expectedDisplay: true
        },
        {
          action: {
            payload: {
              customFeedbackHandlers: { useCustomSuccessHandler: null }
            }
          },
          expectedDisplay: true
        },
        {
          action: {
            payload: {
              customFeedbackHandlers: { useCustomSuccessHandler: false }
            }
          },
          expectedDisplay: true
        },
        {
          action: {
            payload: {
              customFeedbackHandlers: { useCustomSuccessHandler: true }
            }
          },
          expectedDisplay: false
        }
      ];
      assertionData.forEach(data => {
        const action = (data.action as unknown) as FeedbackTriggeringAction;

        const result = EffectFeedback.generateSuccessFeedback(
          'foo',
          action,
          'foo message'
        );
        expect(result.display).toEqual(data.expectedDisplay);
      });
    });
  });
});
