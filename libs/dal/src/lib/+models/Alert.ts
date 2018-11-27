import { AlertMarketingInterface } from './AlertMarketing.interface';
import { AlertQueueInterface } from './AlertQueue.interface';
import { BundleInterface } from './Bundle.interface';
import { GroupInterface } from './Group.interface';
import { PersonInterface } from './Person.interface';
import { TaskInterface } from './Task.interface';
import { UnlockedContentInterface } from './UnlockedContent.interface';

export class Alert implements AlertQueueInterface {
  title: string;
  type: string;
  link?: string;
  validFrom: Date;
  validUntil?: Date;
  created: Date;
  sentAt?: Date;
  read: boolean;
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

  get icon(): string {
    switch (this.type) {
      case 'educontent':
        return 'educontent';

      case 'message':
        return 'messages';

      case 'bundle':
        return 'educontent';

      case 'task':
      case 'task-start':
      case 'task-end':
        return 'tasks';

      case 'boek-e':
        return 'book';

      case 'marketing':
        return 'marketing-message';

      default:
        return 'notifications';
    }
  }
}
