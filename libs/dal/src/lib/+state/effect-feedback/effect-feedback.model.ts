import { Action } from '@ngrx/store';

export enum Priority {
  LOW = 1,
  NORM = 2,
  HIGH = 3
}

export interface EffectFeedbackInterface {
  id: string;
  triggerAction: Action;
  icon?: string;
  message: string;
  type?: 'success' | 'error';
  userActions?: {
    // buttons: expected action is right aligned, first in array
    title: string;
    userAction: Action;
  }[];
  timeStamp?: number;
  display?: boolean;
  priority?: Priority;
  useDefaultCancel?: boolean;
}

export class EffectFeedback implements EffectFeedbackInterface {
  id: string;
  triggerAction: Action;
  icon?: string;
  message: string;
  type: 'success' | 'error' = 'success';
  userActions: {
    // buttons: expected action is right aligned, first in array
    title: string;
    userAction: Action;
  }[] = [];
  timeStamp?: number = Date.now();
  display = true;
  priority?: Priority = Priority.NORM;
  useDefaultCancel? = true;

  constructor(props: EffectFeedbackInterface) {
    Object.assign(this, props);
  }

  static generateErrorFeedback(
    uuid: string,
    action: Action,
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
      priority: Priority.HIGH,
      display: !action['useCustomErrorHandler']
    });
  }

  static generateSuccessFeedback(
    uuid: string,
    action: Action,
    message: string
  ): EffectFeedback {
    return new EffectFeedback({
      id: uuid,
      triggerAction: action,
      message: message
    });
  }
}
