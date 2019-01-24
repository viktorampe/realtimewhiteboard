import { Action } from '@ngrx/store';
import { v4 as uuid } from 'uuid';

export enum Priority {
  LOW = 'low',
  NORM = 'normal',
  HIGH = 'high'
}
export interface EffectFeedbackInterface {
  id: string;
  triggerAction: Action;
  icon?: string;
  message: string;
  type: 'success' | 'error';
  userActions: {
    // buttons: expected action is right aligned, first in array
    title: string;
    userAction: Action;
  }[];
  timeStamp: number;
  display: boolean;
  priority: Priority;
}

export class EffectFeedback implements EffectFeedbackInterface {
  id: string;
  triggerAction: Action;
  icon?: string;
  message: string;
  type: 'success' | 'error';
  userActions: {
    // buttons: expected action is right aligned, first in array
    title: string;
    userAction: Action;
  }[];
  timeStamp: number;
  display: boolean;
  priority: Priority;

  constructor(
    triggerAction: Action,
    icon: string = null,
    message: string,
    type: 'success' | 'error',
    userActions: { title: string; userAction: Action }[],
    display: boolean,
    priority: Priority = Priority.NORM
  ) {
    return {
      id: uuid(),
      triggerAction: triggerAction,
      message: message,
      type: type,
      userActions: userActions,
      timeStamp: Date.now(),
      display: display,
      priority: priority,
      icon: icon
    };
  }
}
