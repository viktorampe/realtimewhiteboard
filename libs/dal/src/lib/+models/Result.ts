import { ResultFunctions } from '@campus/utils';
import { EduContentInterface } from './EduContent.interface';
import { PersonInterface } from './Person.interface';
import { ResultInterface } from './Result.interface';
import { TaskInterface } from './Task.interface';
import { UnlockedContentInterface } from './UnlockedContent.interface';

export class Result implements ResultInterface {
  score?: number;
  time?: number;
  status: any;
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
  lastUpdated?: Date;

  get stars(): number {
    return ResultFunctions.starsFromScore(this.score);
  }
}
