import { Action } from '@ngrx/store';
import {
  EffectFeedbackInterface,
  Priority
} from '../+state/effect-feedback/effect-feedback.model';

export class EffectFeedbackFixture implements EffectFeedbackInterface {
  id = 'thisisaguid';
  triggerAction = {} as Action;
  message = '';
  type: 'success' | 'error' = 'success';
  userActions = [];
  timeStamp = Date.now();
  display = true;
  priority = Priority.NORM;
  icon = null;
  useDefaultCancel: false;

  constructor(props: Partial<EffectFeedbackInterface> = {}) {
    return Object.assign(this, props);
  }
}
