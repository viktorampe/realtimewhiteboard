import { AlertQueueInterface } from './AlertQueue.interface';
import { LearningAreaInterface } from './LearningArea.interface';
import { PersonInterface } from './Person.interface';

export interface AlertMarketingInterface {
  title: string;
  link?: string;
  validFrom: Date;
  validUntil?: Date;
  created: Date;
  queuedAt?: Date;
  queued: boolean;
  id?: number;
  senderId?: number;
  sender?: PersonInterface;
  alertQueues?: AlertQueueInterface[];
  learningAreas?: LearningAreaInterface[];
}
