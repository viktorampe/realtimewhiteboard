import { Alert, AlertQueueInterface } from '../+models';

export class AlertFixture extends Alert {
  title = 'Er is een bundel aangepast.';
  type = 'bundle';
  link = '/linknaarbundle';
  id = 1;
  validFrom = new Date();
  created = new Date();
  read = false;

  constructor(props: Partial<AlertQueueInterface> = {}) {
    super();
    return Object.assign(this, props);
  }
}
