import { Action } from '@ngrx/store';

export enum Priority {
  LOW = 'low',
  NORM = 'normal',
  HIGH = 'high'
}
export interface EffectFeedback {
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
