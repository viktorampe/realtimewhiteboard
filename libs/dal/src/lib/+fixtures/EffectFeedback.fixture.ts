import { SetReadAlert } from '../+state/alert/alert.actions';
import {
  EffectFeedbackInterface,
  Priority
} from '../+state/effect-feedback/effect-feedback.model';

export class EffectFeedbackFixture implements EffectFeedbackInterface {
  id = 'thisisaguid';
  triggerAction = new SetReadAlert({ personId: 1, alertIds: 2 });
  message = '';
  type: 'success' | 'error' = 'success';
  userActions = [];
  timeStamp = Date.now();
  display = true;
  priority = Priority.HIGH;

  constructor(props: Partial<EffectFeedbackInterface> = {}) {
    return Object.assign(this, props);
  }
}
