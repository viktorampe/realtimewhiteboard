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

  get stars(): number {
    if (this.score) {
      if (this.score === 100) {
        return 3;
      }
      if (this.score >= 75) {
        return 2;
      }
      if (this.score >= 50) {
        return 1;
      }
    }
    return 0;
  }
}
