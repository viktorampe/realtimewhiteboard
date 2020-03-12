import { EduContentInterface } from './EduContent.interface';
import { PersonInterface } from './Person.interface';
import { TaskInterface } from './Task.interface';
import { UnlockedContentInterface } from './UnlockedContent.interface';

// equal to all cmi statuses + own extensions
export enum ResultStatus {
  STATUS_INCOMPLETE = 'incomplete',
  STATUS_COMPLETED = 'completed',
  STATUS_PASSED = 'passed',
  STATUS_FAILED = 'failed',
  STATUS_BROWSED = 'browsed',
  STATUS_NOT_ATTEMPTED = 'not attempted',
  // own extensions:
  STATUS_OPENED = 'opened'
}

export interface ResultInterface {
  score?: number;
  time?: number;
  status: ResultStatus;
  cmi?: string;
  created?: Date;
  id?: number;
  eduContentId?: number;
  personId?: number;
  taskId?: number;
  unlockedContentId?: number;
  eduContent?: EduContentInterface;
  person?: PersonInterface;
  task?: TaskInterface;
  unlockedContent?: UnlockedContentInterface;
  learningAreaId: number;
  assignment: string;
  taskInstanceId: number;
  personDisplayName: string;
  bundleId: number;
  stars: number;
}
