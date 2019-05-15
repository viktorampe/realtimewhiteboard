import {
  EffectFeedbackInterface,
  FeedbackTriggeringAction,
  Priority
} from '../+state/effect-feedback/effect-feedback.model';

export class EffectFeedbackFixture implements EffectFeedbackInterface {
  id = 'thisisaguid';
  triggerAction = {} as FeedbackTriggeringAction;
  message = '';
  type: 'success' | 'error' = 'success';
  userActions = [];
  timeStamp = Date.now();
  display = true;
  priority = Priority.NORM;
  useDefaultCancel = true;

  constructor(props: Partial<EffectFeedbackInterface> = {}) {
    return Object.assign(this, props);
  }
}
