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
  useCustomErrorHandler?: boolean;
}

export interface EffectFeedbackConstructorInterface {
  id: string;
  triggerAction: FeedbackTriggeringAction;
  icon?: string;
  message: string;
  type?: 'success' | 'error';
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
  type: 'success' | 'error' = 'success';
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
    this.display = !(this.triggerAction['payload']
      ? this.triggerAction['payload']['useCustomErrorHandler']
      : false);
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
    console.log(action['payload']['useCustomErrorHandler']);
    return new EffectFeedback({
      id: uuid,
      triggerAction: action,
      message: message
    });
  }
}
