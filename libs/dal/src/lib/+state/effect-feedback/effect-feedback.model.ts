import { Action } from '@ngrx/store';
import uuid = require('uuid');

export enum Priority {
  LOW = 1,
  NORM = 2,
  HIGH = 3
}

const uuidFactory = () => {
  return uuid;
};

export let uuidProvider = {
  provide: 'uuid',
  useFactory: uuidFactory,
  deps: []
};

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
    id: string,
    triggerAction: Action,
    message: string,
    type: 'success' | 'error',
    userActions: { title: string; userAction: Action }[],
    display: boolean,
    icon: string = null,
    priority: Priority = Priority.NORM
  ) {
    this.id = id;
    this.triggerAction = triggerAction;
    this.message = message;
    this.type = type;
    this.userActions = userActions;
    this.timeStamp = Date.now();
    this.display = display;
    this.priority = priority;
    this.icon = icon;
  }
}
