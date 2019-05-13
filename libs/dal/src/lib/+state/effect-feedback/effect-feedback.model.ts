import { Action } from '@ngrx/store';

export enum Priority {
  LOW = 1,
  NORM = 2,
  HIGH = 3
}

export interface FeedbackTriggeringAction extends Action {
  payload: FeedbackTriggeringPayload;
}
export interface FeedbackTriggeringPayload {
  customFeedbackHandlers?: CustomFeedbackHandlersInterface;
}

export interface CustomFeedbackHandlersInterface {
  useCustomSuccessHandler?: boolean;
  useCustomErrorHandler?: boolean;
}

export type EffectFeedbackType = 'success' | 'error';

export interface EffectFeedbackConstructorInterface {
  id: string;
  triggerAction: FeedbackTriggeringAction;
  icon?: string;
  message: string;
  type?: EffectFeedbackType;
  userActions?: {
    // buttons: expected action is right aligned, first in array
    title: string;
    userAction: Action;
  }[];
  timeStamp?: number;
  priority?: Priority;
  useDefaultCancel?: boolean;
}

export interface EffectFeedbackInterface
  extends EffectFeedbackConstructorInterface {
  display?: boolean;
}

export class EffectFeedback implements EffectFeedbackInterface {
  id: string;
  triggerAction: FeedbackTriggeringAction;
  icon?: string;
  message: string;
  type: EffectFeedbackType = 'success';
  userActions: {
    // buttons: expected action is right aligned, first in array
    title: string;
    userAction: Action;
  }[] = [];
  timeStamp?: number = Date.now();
  display: boolean;
  priority?: Priority = Priority.NORM;
  useDefaultCancel? = true;

  constructor(props: EffectFeedbackConstructorInterface) {
    Object.assign(this, props);
    this.display = !EffectFeedback.getCustomHandlerValue(
      this.triggerAction.payload,
      this.type
    );
  }

  private static getCustomHandlerValue(
    payload: FeedbackTriggeringPayload,
    type: EffectFeedbackType
  ) {
    if (!payload || !payload.customFeedbackHandlers) return false;
    switch (type) {
      case 'error':
        return payload.customFeedbackHandlers.useCustomErrorHandler || false;
      case 'success':
        return payload.customFeedbackHandlers.useCustomSuccessHandler || false;
      default:
        return false;
    }
  }

  static generateErrorFeedback(
    uuid: string,
    action: FeedbackTriggeringAction,
    message: string
  ): EffectFeedback {
    return new EffectFeedback({
      id: uuid,
      triggerAction: action,
      message: message,
      type: 'error',
      userActions: [
        {
          title: 'Opnieuw proberen',
          userAction: action
        }
      ],
      priority: Priority.HIGH
    });
  }

  static generateSuccessFeedback(
    uuid: string,
    action: FeedbackTriggeringAction,
    message: string
  ): EffectFeedback {
    return new EffectFeedback({
      id: uuid,
      triggerAction: action,
      message: message
    });
  }
}
