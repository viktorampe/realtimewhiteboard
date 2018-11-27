import {
  AlertMarketingInterface,
  AlertQueueInterface,
  BundleInterface,
  GroupInterface,
  PersonInterface,
  TaskInterface,
  UnlockedContentInterface
} from '../+models';

export class AlertFixture implements AlertQueueInterface {
  title = 'Er is een bundel aangepast.';
  type = 'bundle';
  link? = '/linknaarbundle';
  validFrom = new Date();
  validUntil?: Date;
  created = new Date();
  sentAt?: Date;
  read = false;
  message?: string;
  messageId?: number;
  id?: number;
  senderId?: number;
  recipientId?: number;
  groupId?: number;
  studentId?: number;
  bundleId?: number;
  unlockedContentId?: number;
  taskId?: number;
  alertMarketingId?: number;
  sender?: PersonInterface;
  recipient?: PersonInterface;
  group?: GroupInterface;
  student?: PersonInterface;
  bundle?: BundleInterface;
  unlockedContent?: UnlockedContentInterface;
  task?: TaskInterface;
  alertMarketing?: AlertMarketingInterface;

  constructor(props: Partial<AlertQueueInterface> = {}) {
    return Object.assign(this, props);
  }

  get icon() {
    switch (this.type) {
      case 'educontent':
        return 'educontent';

      case 'message':
        return 'envelope-open';

      case 'bundle':
        return 'educontent';

      case 'task':
      case 'task-start':
      case 'task-end':
        return 'tasks';

      case 'boek-e':
        return 'book';

      case 'marketing':
        return 'polpo';

      default:
        return 'notifications';
    }
  }
}
