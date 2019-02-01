import { Action } from '@ngrx/store';
import uuid = require('uuid');

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
  type: 'success' | 'error';
  userActions?: {
    // buttons: expected action is right aligned, first in array
    title: string;
    userAction: Action;
  }[];
  timeStamp?: number;
  display: boolean;
  priority?: Priority;
  useDefaultCancel?: boolean;
}

export class EffectFeedback implements EffectFeedbackInterface {
  id: string;
  triggerAction: Action;
  icon: string = null;
  message: string;
  type: 'success' | 'error';
  userActions: {
    // buttons: expected action is right aligned, first in array
    title: string;
    userAction: Action;
  }[] = [];
  timeStamp: number = Date.now();
  display = true;
  priority?: Priority = Priority.NORM;
  useDefaultCancel? = true;

  constructor(props: EffectFeedbackInterface) {
    Object.assign(this, props);
  }
}
