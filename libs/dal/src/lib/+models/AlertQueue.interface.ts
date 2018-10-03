import { AlertMarketingInterface } from './AlertMarketing.interface';
import { BundleInterface } from './Bundle.interface';
import { GroupInterface } from './Group.interface';
import { PersonInterface } from './Person.interface';
import { TaskInterface } from './Task.interface';
import { UnlockedContentInterface } from './UnlockedContent.interface';

export interface AlertQueueInterface {
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
}
