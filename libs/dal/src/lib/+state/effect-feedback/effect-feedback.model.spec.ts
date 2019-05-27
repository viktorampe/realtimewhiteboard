import {
  EffectFeedback,
  FeedbackTriggeringAction,
  FeedbackTriggeringPayload
} from './effect-feedback.model';

describe('EffectFeedback model', () => {
  describe('generateErrorFeedback', () => {
    it('should display error and succes feedback depending on action.payload.customFeedbackHandlers data', () => {
      const assertionData: {
        action: { payload: FeedbackTriggeringPayload };
        expectedErrorDisplay: boolean;
        expectedSuccessDisplay: boolean;
      }[] = [
        {
          action: undefined,
          expectedErrorDisplay: true,
          expectedSuccessDisplay: true
        },
        {
          action: null,
          expectedErrorDisplay: true,
          expectedSuccessDisplay: true
        },
        {
          action: { payload: undefined },
          expectedErrorDisplay: true,
          expectedSuccessDisplay: true
        },
        {
          action: { payload: null },
          expectedErrorDisplay: true,
          expectedSuccessDisplay: true
        },
        {
          action: { payload: {} },
          expectedErrorDisplay: true,
          expectedSuccessDisplay: true
        },
        {
          action: { payload: { customFeedbackHandlers: undefined } },
          expectedErrorDisplay: true,
          expectedSuccessDisplay: true
        },
        {
          action: { payload: { customFeedbackHandlers: null } },
          expectedErrorDisplay: true,
          expectedSuccessDisplay: true
        },
        {
          action: {
            payload: {
              customFeedbackHandlers: {
                useCustomErrorHandler: undefined,
                useCustomSuccessHandler: undefined
              }
            }
          },
          expectedErrorDisplay: true,
          expectedSuccessDisplay: true
        },
        {
          action: {
            payload: {
              customFeedbackHandlers: {
                useCustomErrorHandler: null,
                useCustomSuccessHandler: null
              }
            }
          },
          expectedErrorDisplay: true,
          expectedSuccessDisplay: true
        },
        {
          action: {
            payload: {
              customFeedbackHandlers: {
                useCustomErrorHandler: false,
                useCustomSuccessHandler: false
              }
            }
          },
          expectedErrorDisplay: true,
          expectedSuccessDisplay: true
        },
        {
          action: {
            payload: {
              customFeedbackHandlers: {
                useCustomErrorHandler: true,
                useCustomSuccessHandler: true
              }
            }
          },
          expectedErrorDisplay: false,
          expectedSuccessDisplay: false
        },
        {
          action: {
            payload: {
              customFeedbackHandlers: {
                useCustomErrorHandler: 'useNoHandler',
                useCustomSuccessHandler: 'useNoHandler'
              }
            }
          },
          expectedErrorDisplay: false,
          expectedSuccessDisplay: false
        }
      ];
      assertionData.forEach(data => {
        const action = (data.action as unknown) as FeedbackTriggeringAction;

        const errorResult = EffectFeedback.generateErrorFeedback(
          'foo',
          action,
          'foo error message'
        );
        expect(errorResult.display).toEqual(data.expectedErrorDisplay);

        const successResult = EffectFeedback.generateSuccessFeedback(
          'foo',
          action,
          'foo success message'
        );
        expect(successResult.display).toEqual(data.expectedSuccessDisplay);
      });
    });
  });
});
